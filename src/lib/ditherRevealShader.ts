import * as THREE from 'three/webgpu'
import type { Node } from 'three/webgpu'
import {
  Fn,
  texture as tslTexture,
  uv,
  screenCoordinate,
  uniform,
  vec3,
  vec4,
  float,
  floor,
  max,
  mix,
  length,
  glslFn,
  select,
} from 'three/tsl'
import type { UniformNodes, BlockOptions } from './ditherRevealTypes'

const FADE_SCALE_1 = 4
const FADE_SCALE_2 = 16
const FADE_SCALE_3 = 64
const FADE_MIX_2 = 0.25
const FADE_MIX_3 = 0.25

const orderedDitherGLSL = glslFn(`
  bool orderedDither(float brightness, vec2 pos, float ditherPx) {
    if (brightness > 16.0 / 17.0) return false;
    if (brightness < 1.0 / 17.0) return true;

    vec2 p = floor(mod(pos / ditherPx, 4.0));
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
`)

function buildFragmentNode(textureNode: ReturnType<typeof tslTexture>, uniforms: UniformNodes) {
  const { uBlockSize, uFade, uPxSize, uDitherPx, uUseAlpha } = uniforms

  return Fn(() => {
    const grid = uBlockSize.div(uPxSize)
    const cellUV = floor(uv().mul(grid)).add(0.5).div(grid)
    const color = textureNode.sample(cellUV)
    const tone = max(color.r, max(color.g, color.b))
    const toneBlended = mix(tone, length(color.rgb), float(0.1))
    const toneFinal = toneBlended.mul(mix(float(1), toneBlended, float(0.5)))

    const od = orderedDitherGLSL as (...args: Node[]) => Node<'bool'>

    const dithered = select(od(toneFinal, screenCoordinate, uDitherPx), float(0), float(1))

    const m1 = select(
      od(uFade, floor(screenCoordinate.div(FADE_SCALE_1)), uDitherPx),
      float(0),
      float(1),
    )
    const m2 = select(
      od(uFade, floor(screenCoordinate.div(FADE_SCALE_2)), uDitherPx),
      float(0),
      float(1),
    )
    const m3 = select(
      od(uFade, floor(screenCoordinate.div(FADE_SCALE_3)), uDitherPx),
      float(0),
      float(1),
    )
    const fadeMask = mix(mix(m1, m2, float(FADE_MIX_2)), m3, float(FADE_MIX_3))

    const result = mix(dithered, toneFinal, fadeMask)

    const alpha = select(uUseAlpha.greaterThan(float(0.5)), float(1).sub(result), float(1))
    const outColor = select(uUseAlpha.greaterThan(float(0.5)), vec3(float(0)), vec3(result))

    return vec4(outColor, alpha)
  })()
}

function createUniforms(opts: Required<BlockOptions>): UniformNodes {
  return {
    uBlockSize: uniform(new THREE.Vector2(1, 1)),
    uFade: uniform(0),
    uPxSize: uniform(opts.pxSizeStart),
    uDitherPx: uniform(opts.ditherPx),
    uUseAlpha: uniform(opts.useAlpha ? 1 : 0),
  }
}

function createBlockMaterial(
  textureNode: ReturnType<typeof tslTexture>,
  uniforms: UniformNodes,
  transparent: boolean,
): THREE.MeshBasicNodeMaterial {
  const fragNode = buildFragmentNode(textureNode, uniforms)
  return new THREE.MeshBasicNodeMaterial({
    fragmentNode: fragNode,
    transparent,
  })
}

function createBlockMaterialFromTexture(
  loaded: THREE.Texture,
  uniforms: UniformNodes,
  useAlpha: boolean,
): THREE.MeshBasicNodeMaterial {
  loaded.colorSpace = THREE.SRGBColorSpace
  loaded.minFilter = THREE.LinearFilter
  loaded.magFilter = THREE.LinearFilter
  const texNode = tslTexture(loaded)
  return createBlockMaterial(texNode, uniforms, useAlpha)
}

export { buildFragmentNode, createUniforms, createBlockMaterial, createBlockMaterialFromTexture }
