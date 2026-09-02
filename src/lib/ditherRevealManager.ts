import * as THREE from 'three/webgpu'
import { WebGPURenderer } from 'three/webgpu'
import type { BlockOptions, Block } from './ditherRevealTypes'
import { createUniforms, createBlockMaterialFromTexture } from './ditherRevealShader'

const MAX_DPR = 2

/** Ancestors whose overflow clips descendants (anything but `visible`). */
function collectClipAncestors(el: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = []
  let node = el.parentElement
  while (node && node !== document.body && node !== document.documentElement) {
    const cs = getComputedStyle(node)
    const clips = [cs.overflow, cs.overflowX, cs.overflowY].some((v) => v && v !== 'visible')
    if (clips) out.push(node)
    node = node.parentElement
  }
  return out
}

class DitherRevealManager {
  private renderer: WebGPURenderer | null = null
  private scene: THREE.Scene | null = null
  private camera: THREE.OrthographicCamera | null = null
  private overlayCanvas: HTMLCanvasElement | null = null
  private ctx2d: CanvasRenderingContext2D | null = null
  private offscreen: HTMLCanvasElement | null = null
  private blocks = new Map<string, Block>()
  private animId: number | null = null
  private initialized = false
  private ready = false
  private dpr = 1
  private frameCount = 0
  private needsRender = true
  private textureLoader = new THREE.TextureLoader()

  private readonly defaultEasing = (t: number) => t * t

  private ensureInit() {
    if (this.initialized) return
    this.initialized = true

    this.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const w = window.innerWidth
    const h = window.innerHeight
    const bw = Math.round(w * this.dpr)
    const bh = Math.round(h * this.dpr)

    this.overlayCanvas = document.createElement('canvas')
    this.overlayCanvas.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999'
    this.overlayCanvas.width = bw
    this.overlayCanvas.height = bh
    document.body.append(this.overlayCanvas)
    this.ctx2d = this.overlayCanvas.getContext('2d')!

    this.offscreen = document.createElement('canvas')
    this.offscreen.width = bw
    this.offscreen.height = bh

    const glCtx = this.offscreen.getContext('webgl2', { antialias: false, alpha: true })

    this.renderer = new WebGPURenderer({
      canvas: this.offscreen,
      context: glCtx!,
      forceWebGL: true,
      antialias: false,
      alpha: true,
    })
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(bw, bh, false)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace

    this.scene = new THREE.Scene()

    this.camera = new THREE.OrthographicCamera(0, bw, bh, 0, 0, 100)
    this.camera.position.set(0, 0, 10)
    this.camera.lookAt(0, 0, 0)

    window.addEventListener('resize', this.onResize)

    this.renderer.init().then(() => {
      this.ready = true
      this.needsRender = true
      this.startLoop()
    })
  }

  private onResize = () => {
    if (!this.overlayCanvas || !this.offscreen || !this.renderer || !this.camera) return
    this.dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
    const w = window.innerWidth
    const h = window.innerHeight
    const bw = Math.round(w * this.dpr)
    const bh = Math.round(h * this.dpr)
    this.overlayCanvas.width = bw
    this.overlayCanvas.height = bh
    this.offscreen.width = bw
    this.offscreen.height = bh
    this.renderer.setSize(bw, bh, false)
    this.camera.left = 0
    this.camera.right = bw
    this.camera.top = bh
    this.camera.bottom = 0
    this.camera.updateProjectionMatrix()
    this.needsRender = true
  }

  private startLoop() {
    const loop = () => {
      this.animId = requestAnimationFrame(loop)
      this.renderFrame()
    }
    loop()
  }

  private renderFrame() {
    if (
      !this.ready ||
      !this.renderer ||
      !this.camera ||
      !this.scene ||
      !this.overlayCanvas ||
      !this.ctx2d ||
      !this.offscreen
    )
      return

    let dirty = this.needsRender

    for (const block of this.blocks.values()) {
      const rect = block.el.getBoundingClientRect()
      const bw = rect.width * this.dpr
      const bh = rect.height * this.dpr
      const cx = (rect.left + rect.width / 2) * this.dpr
      const cy = this.overlayCanvas.height - (rect.top + rect.height / 2) * this.dpr

      // Visible part of the block: its rect ∩ viewport ∩ every clipping ancestor's client box.
      let vl = Math.max(rect.left, 0)
      let vt = Math.max(rect.top, 0)
      let vr = Math.min(rect.left + rect.width, window.innerWidth)
      let vb = Math.min(rect.top + rect.height, window.innerHeight)
      for (const anc of block.clipAncestors) {
        const ar = anc.getBoundingClientRect()
        const al = ar.left + anc.clientLeft
        const at = ar.top + anc.clientTop
        vl = Math.max(vl, al)
        vt = Math.max(vt, at)
        vr = Math.min(vr, al + anc.clientWidth)
        vb = Math.min(vb, at + anc.clientHeight)
      }
      const vx = Math.floor(vl * this.dpr)
      const vy = Math.floor(vt * this.dpr)
      const vw = Math.max(0, Math.ceil(vr * this.dpr) - vx)
      const vh = Math.max(0, Math.ceil(vb * this.dpr) - vy)

      const l = block.layout
      if (l.cx !== cx || l.cy !== cy || l.bw !== bw || l.bh !== bh) {
        l.cx = cx
        l.cy = cy
        l.bw = bw
        l.bh = bh
        block.mesh.position.set(cx, cy, 0)
        block.mesh.scale.set(bw, bh, 1)
        block.uniforms.uBlockSize.value.set(bw, bh)
        dirty = true
      }
      if (l.vx !== vx || l.vy !== vy || l.vw !== vw || l.vh !== vh) {
        l.vx = vx
        l.vy = vy
        l.vw = vw
        l.vh = vh
        dirty = true
      }

      if (block.isPlaying) {
        if (block.fadeStart === 0) block.fadeStart = performance.now()
        this.tickBlock(block)
        dirty = true
      }
    }

    if (!dirty) return
    this.needsRender = false

    this.renderer.render(this.scene, this.camera)

    this.ctx2d.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height)
    for (const block of this.blocks.values()) {
      const { vx, vy, vw, vh } = block.layout
      if (vw <= 0 || vh <= 0) continue
      this.ctx2d.drawImage(this.offscreen, vx, vy, vw, vh, vx, vy, vw, vh)
    }

    if (import.meta.env.DEV && ++this.frameCount % 60 === 0) {
      this.logDebugInfo()
    }
  }

  private tickBlock(block: Block) {
    const elapsed = performance.now() - block.fadeStart
    const linearT = Math.min(elapsed / block.options.duration, 1)
    const t = block.options.easing(linearT)

    block.uniforms.uFade.value = t
    block.uniforms.uPxSize.value = this.getPixelationValue(block, linearT)

    if (linearT >= 1) {
      block.isPlaying = false
      block.isDone = true
      block.onDone?.()
      block.onDone = null
    }
  }

  private getPixelationValue(block: Block, progress: number): number {
    const { pxSizeStart, pxSizeEnd, pixelationSteps } = block.options
    if (pixelationSteps.length > 0) {
      const idx = Math.min(
        Math.floor(progress * pixelationSteps.length),
        pixelationSteps.length - 1,
      )
      return pixelationSteps[idx] ?? pxSizeEnd
    }
    return pxSizeStart + (pxSizeEnd - pxSizeStart) * progress
  }

  register(id: string, el: HTMLElement, options: BlockOptions) {
    this.ensureInit()

    const opts: Required<BlockOptions> = {
      src: options.src,
      pxSizeStart: options.pxSizeStart ?? 24,
      pxSizeEnd: options.pxSizeEnd ?? 1,
      ditherPx: options.ditherPx ?? 1,
      duration: options.duration ?? 1600,
      easing: options.easing ?? this.defaultEasing,
      useAlpha: options.useAlpha ?? false,
      pixelationSteps: options.pixelationSteps ?? [],
      playOnVisible: options.playOnVisible ?? true,
    }

    const uniforms = createUniforms(opts)
    const geo = new THREE.PlaneGeometry(1, 1)
    const mesh = new THREE.Mesh(geo, new THREE.MeshBasicNodeMaterial({ transparent: true }))
    mesh.frustumCulled = false

    this.blocks.set(id, {
      id,
      el,
      mesh,
      material: mesh.material as THREE.MeshBasicNodeMaterial,
      options: opts,
      isPlaying: false,
      isDone: false,
      fadeStart: 0,
      onDone: null,
      uniforms,
      texture: null!,
      clipAncestors: collectClipAncestors(el),
      layout: { cx: NaN, cy: NaN, bw: NaN, bh: NaN, vx: NaN, vy: NaN, vw: NaN, vh: NaN },
    })

    this.textureLoader.load(
      opts.src,
      (loaded) => {
        if (!this.blocks.has(id)) return
        const mat = createBlockMaterialFromTexture(loaded, uniforms, opts.useAlpha)
        mesh.material = mat
        this.scene!.add(mesh)

        const b = this.blocks.get(id)!
        b.material = mat
        b.texture = loaded
        this.needsRender = true
      },
      undefined,
      (err) => {
        if (import.meta.env.DEV)
          console.error('[DitherRevealManager] texture load error', id, opts.src, err)
      },
    )

    return {
      play: (onDone?: () => void) => {
        const b = this.blocks.get(id)
        if (!b) return
        b.isPlaying = true
        b.isDone = false
        b.fadeStart = 0
        b.onDone = onDone ?? null
      },
    }
  }

  unregister(id: string) {
    const block = this.blocks.get(id)
    if (!block) return
    this.scene!.remove(block.mesh)
    block.mesh.geometry.dispose()
    block.material.dispose()
    if (block.texture) block.texture.dispose()
    this.blocks.delete(id)
    this.needsRender = true
  }

  destroy() {
    if (this.animId !== null) cancelAnimationFrame(this.animId)
    window.removeEventListener('resize', this.onResize)
    for (const id of this.blocks.keys()) this.unregister(id)
    this.renderer?.dispose()
    this.overlayCanvas?.remove()
    this.renderer = null
    this.scene = null
    this.camera = null
    this.offscreen = null
    this.overlayCanvas = null
    this.ctx2d = null
    this.initialized = false
    this.ready = false
  }

  hasBlock(id: string) {
    return this.blocks.has(id)
  }

  private logDebugInfo() {
    if (!this.ctx2d || !this.overlayCanvas) return
    try {
      const cx = this.overlayCanvas.width / 2
      const cy = this.overlayCanvas.height / 2
      const d = this.ctx2d.getImageData(Math.round(cx), Math.round(cy), 1, 1).data
      let info = `[dm] blocks=${this.blocks.size} center2d=${d[0]},${d[1]},${d[2]},${d[3]}`

      for (const [blkId, blk] of this.blocks.entries()) {
        const r = blk.el.getBoundingClientRect()
        const bx = Math.round(r.left + r.width / 2)
        const by = Math.round(r.top + r.height / 2)
        const dp = this.ctx2d.getImageData(bx, by, 1, 1).data
        info += ` | ${blkId}: pos=(${Math.round(r.left)},${Math.round(r.top)}) size=(${Math.round(r.width)},${Math.round(r.height)}) playing=${blk.isPlaying} done=${blk.isDone} fade=${blk.uniforms.uFade.value.toFixed(2)} pixel2d=${dp[0]},${dp[1]},${dp[2]},${dp[3]}`
      }
      console.log(info)
    } catch (e) {
      console.log('[dm] log error', e)
    }
  }
}

let instance: DitherRevealManager | null = null

export function getDitherRevealManager(): DitherRevealManager {
  if (!instance) instance = new DitherRevealManager()
  return instance
}

if (import.meta.env.DEV) {
  const dw = window as unknown as { __debugDither: (method: string) => unknown }
  dw.__debugDither = (method: string) => {
    const m = instance
    if (!m) return 'no instance'
    const dh = m as unknown as {
      renderFrame(): void
      blocks: Map<string, unknown>
      initialized: boolean
      overlayCanvas: HTMLCanvasElement | null
      scene: { children: unknown[] } | null
      camera: unknown
    }
    if (method === 'render') {
      dh.renderFrame()
      return 'rendered'
    }
    if (method === 'info') {
      return {
        blocks: dh.blocks.size,
        initialized: dh.initialized,
        canvasSize: dh.overlayCanvas
          ? `${dh.overlayCanvas.width}x${dh.overlayCanvas.height}`
          : 'no canvas',
        hasScene: !!dh.scene,
        hasCamera: !!dh.camera,
        sceneChildren: dh.scene?.children?.length ?? 0,
      }
    }
    return 'unknown method'
  }
}

export type { BlockOptions }
