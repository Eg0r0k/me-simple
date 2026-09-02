precision mediump float;

varying vec2 vUv;

uniform vec2 uBlockSize;
uniform sampler2D uTexture;
uniform float uPxSize;
uniform float uDitherPx;
uniform float uFade;
uniform float uUseAlpha;

const float FADE_SCALE_1 = 4.0;
const float FADE_SCALE_2 = 16.0;
const float FADE_SCALE_3 = 64.0;
const float FADE_MIX_2 = 0.25;
const float FADE_MIX_3 = 0.25;

bool orderedDither(float brightness, vec2 pos) {
    if (brightness > 16.0 / 17.0) return false;
    if (brightness < 1.0 / 17.0) return true;

    vec2 p = floor(mod(pos / uDitherPx, 4.0));
    int x = int(p.x);
    int y = int(p.y);

    if (x == 0 && y == 0) return brightness < 16.0 / 17.0;
    if (x == 2 && y == 2) return brightness < 15.0 / 17.0;
    if (x == 2 && y == 0) return brightness < 14.0 / 17.0;
    if (x == 0 && y == 2) return brightness < 13.0 / 17.0;
    if (x == 1 && y == 1) return brightness < 12.0 / 17.0;
    if (x == 3 && y == 3) return brightness < 11.0 / 17.0;
    if (x == 3 && y == 1) return brightness < 10.0 / 17.0;
    if (x == 1 && y == 3) return brightness < 9.0  / 17.0;
    if (x == 1 && y == 0) return brightness < 8.0  / 17.0;
    if (x == 3 && y == 2) return brightness < 7.0  / 17.0;
    if (x == 3 && y == 0) return brightness < 6.0  / 17.0;
    if (x == 0 && y == 1) return brightness < 5.0  / 17.0;
    if (x == 1 && y == 2) return brightness < 4.0  / 17.0;
    if (x == 2 && y == 3) return brightness < 3.0  / 17.0;
    if (x == 2 && y == 1) return brightness < 2.0  / 17.0;
    return brightness < 1.0 / 17.0;
}

void main() {
    vec2 grid = uBlockSize / uPxSize;
    vec2 cellUV = (floor(vUv * grid) + 0.5) / grid;
    vec4 color = texture2D(uTexture, cellUV);

    float tone = max(color.r, max(color.g, color.b));
    tone = mix(tone, length(color.rgb), 0.1);
    tone = tone * mix(1.0, tone, 0.5);

    float dithered = orderedDither(tone, gl_FragCoord.xy) ? 0.0 : 1.0;

    float m1 = orderedDither(uFade, floor(gl_FragCoord.xy / FADE_SCALE_1)) ? 0.0 : 1.0;
    float m2 = orderedDither(uFade, floor(gl_FragCoord.xy / FADE_SCALE_2)) ? 0.0 : 1.0;
    float m3 = orderedDither(uFade, floor(gl_FragCoord.xy / FADE_SCALE_3)) ? 0.0 : 1.0;
    float fadeMask = mix(mix(m1, m2, FADE_MIX_2), m3, FADE_MIX_3);

    float result = mix(dithered, tone, fadeMask);

    if (uUseAlpha > 0.5) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0 - result);
    } else {
        gl_FragColor = vec4(result, result, result, 1.0);
    }
}
