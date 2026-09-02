precision highp float;

uniform float uTime;
uniform vec2  uRes;
uniform vec3  uColorA;
uniform vec3  uColorB;
uniform float uPxSize;
uniform float uDitherType;
uniform float uDitherStrength; // 0 = без дизера (плоский силуэт), 1 = корректный ordered dithering, >1 = усиленный
uniform sampler2D uMediaTex;
uniform float uMediaAspect;

// ── Hash ───────────────────────────────────────────────────────────────────

float hash21(vec2 p) {
  p = fract(p * vec2(0.3183099, 0.3678794)) + 0.1;
  p += dot(p, p + 19.19);
  return fract(p.x * p.y);
}

// ── Bayer matrices ─────────────────────────────────────────────────────────
// Значения уже совпадают со стандартными эталонными матрицами Байера — не трогаем.

float bayerValue2(ivec2 pos) {
  int m[4];
  m[0] = 0; m[1] = 2; m[2] = 3; m[3] = 1;
  int idx = (pos.y % 2) * 2 + (pos.x % 2);
  return float(m[idx]) / 4.0;
}

float bayerValue4(ivec2 pos) {
  int m[16];
  m[ 0] = 0;  m[ 1] = 8;  m[ 2] = 2;  m[ 3] = 10;
  m[ 4] = 12; m[ 5] = 4;  m[ 6] = 14; m[ 7] = 6;
  m[ 8] = 3;  m[ 9] = 11; m[10] = 1;  m[11] = 9;
  m[12] = 15; m[13] = 7;  m[14] = 13; m[15] = 5;
  int idx = (pos.y % 4) * 4 + (pos.x % 4);
  return float(m[idx]) / 16.0;
}

float bayerValue8(ivec2 pos) {
  int m[64];
  m[ 0] = 0;  m[ 1] = 32; m[ 2] = 8;  m[ 3] = 40; m[ 4] = 2;  m[ 5] = 34; m[ 6] = 10; m[ 7] = 42;
  m[ 8] = 48; m[ 9] = 16; m[10] = 56; m[11] = 24; m[12] = 50; m[13] = 18; m[14] = 58; m[15] = 26;
  m[16] = 12; m[17] = 44; m[18] = 4;  m[19] = 36; m[20] = 14; m[21] = 46; m[22] = 6;  m[23] = 38;
  m[24] = 60; m[25] = 28; m[26] = 52; m[27] = 20; m[28] = 62; m[29] = 30; m[30] = 54; m[31] = 22;
  m[32] = 3;  m[33] = 35; m[34] = 11; m[35] = 43; m[36] = 1;  m[37] = 33; m[38] = 9;  m[39] = 41;
  m[40] = 51; m[41] = 19; m[42] = 59; m[43] = 27; m[44] = 49; m[45] = 17; m[46] = 57; m[47] = 25;
  m[48] = 15; m[49] = 47; m[50] = 7;  m[51] = 39; m[52] = 13; m[53] = 45; m[54] = 5;  m[55] = 37;
  m[56] = 63; m[57] = 31; m[58] = 55; m[59] = 23; m[60] = 61; m[61] = 29; m[62] = 53; m[63] = 21;
  int idx = (pos.y % 8) * 8 + (pos.x % 8);
  return float(m[idx]) / 64.0;
}

// uv здесь уже ожидается block-aligned (целые координаты макро-пикселя)
float getBayerValue(vec2 uv, int size) {
  ivec2 pos = ivec2(mod(uv, float(size)));
  if (size == 2) return bayerValue2(pos);
  if (size == 4) return bayerValue4(pos);
  return bayerValue8(pos);
}

// ── Main ───────────────────────────────────────────────────────────────────

void main() {
  float pxSize = uPxSize;

  // Pixel grid
  vec2 pxSizeUV = gl_FragCoord.xy - 0.5 * uRes;
  pxSizeUV /= pxSize;
  vec2 blockUV = floor(pxSizeUV); // фикс: явный floor вместо неявного округления через ivec2()
  vec2 canvasPixelizedUV = (blockUV + 0.5) * pxSize;
  vec2 uv = canvasPixelizedUV / uRes + 0.5;

  // ditherUV теперь ровно те же целые координаты, что и блок пикселизации —
  // паттерн дизера гарантированно выровнен по макро-пикселю без дребезга на границах
  vec2 ditherUV = blockUV;

  // object-fit: cover mapping
  vec2 mediaUV = uv;
  float canvasAspect = uRes.x / uRes.y;
  if (canvasAspect > uMediaAspect) {
    float s = canvasAspect / uMediaAspect;
    mediaUV.y = (mediaUV.y - 0.5) / s + 0.5;
  } else {
    float s = uMediaAspect / canvasAspect;
    mediaUV.x = (mediaUV.x - 0.5) / s + 0.5;
  }

  // Sample media pixel
  vec4 mediaColor = texture2D(uMediaTex, mediaUV);

  // Grayscale (luminosity)
  float gray = dot(mediaColor.rgb, vec3(0.299, 0.587, 0.114));

  // Dither threshold map, нормализованный в 0..1
  int type = int(floor(uDitherType));
  float threshold;

  if (type == 1) {
    threshold = hash21(ditherUV);
  } else if (type == 2) {
    threshold = getBayerValue(ditherUV, 2);
  } else if (type == 3) {
    threshold = getBayerValue(ditherUV, 4);
  } else {
    threshold = getBayerValue(ditherUV, 8);
  }

  // Cut off dither near black/white — pure tones stay solid
  float darkCut = 0.12;
  float lightCut = 0.88;
  float midGray = (gray - darkCut) / (lightCut - darkCut);
  midGray = clamp(midGray, 0.0, 1.0);

  // Каноническая формула ordered dithering: к значению добавляется
  // центрированный порог из threshold map, затем идёт жёсткое квантование.
  // uDitherStrength теперь реально на что-то влияет:
  //   0.0 → чистый силуэт без текстуры дизера (порог ровно 0.5)
  //   1.0 → стандартный корректный ordered dithering
  //   >1.0 → усиленный/шумный дизер
  float ditheredValue = midGray + (threshold - 0.5) * uDitherStrength;
  float res = step(0.5, ditheredValue);

  vec3 col = mix(uColorA, uColorB, res);
  gl_FragColor = vec4(col, 1.0);
}
