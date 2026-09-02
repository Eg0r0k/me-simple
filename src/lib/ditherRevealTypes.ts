import * as THREE from 'three/webgpu'
import type { UniformNode } from 'three/webgpu'

export interface BlockOptions {
  src: string
  pxSizeStart?: number
  pxSizeEnd?: number
  ditherPx?: number
  duration?: number
  easing?: (t: number) => number
  useAlpha?: boolean
  pixelationSteps?: number[]
  playOnVisible?: boolean
}

export interface UniformNodes {
  uBlockSize: UniformNode<'vec2', THREE.Vector2>
  uFade: UniformNode<'float', number>
  uPxSize: UniformNode<'float', number>
  uDitherPx: UniformNode<'float', number>
  uUseAlpha: UniformNode<'float', number>
}

export interface Block {
  id: string
  el: HTMLElement
  mesh: THREE.Mesh
  material: THREE.MeshBasicNodeMaterial
  options: Required<BlockOptions>
  isPlaying: boolean
  isDone: boolean
  fadeStart: number
  onDone: (() => void) | null
  uniforms: UniformNodes
  texture: THREE.Texture | null
  /** Ancestors with non-visible overflow; the block is drawn only inside their client boxes. */
  clipAncestors: HTMLElement[]
  /**
   * Last layout, in overlay pixels. cx/cy/bw/bh are what was pushed to the mesh,
   * vx/vy/vw/vh is the visible (clipped) rect copied to the overlay. Used to skip idle frames.
   */
  layout: {
    cx: number
    cy: number
    bw: number
    bh: number
    vx: number
    vy: number
    vw: number
    vh: number
  }
}
