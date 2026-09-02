import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const capturedTextureLoader = vi.hoisted(() => ({
  onLoad: null as ((tex: any) => void) | null,
  onError: null as ((err: any) => void) | null,
}))

const chainable = vi.hoisted(() => {
  function c(val?: any) {
    const o: any = () => o
    o.value = val ?? 0
    o.x = 0; o.y = 0; o.z = 0; o.w = 0
    o.r = 0; o.g = 0; o.b = 0; o.a = 0
    o.add = () => c(); o.sub = () => c()
    o.mul = () => c(); o.div = () => c()
    o.mix = () => c(); o.max = () => c()
    o.floor = () => c(); o.mod = () => c()
    o.sample = () => c()
    o.greaterThan = () => c()
    o.set = vi.fn((nx?: number, ny?: number) => { if (nx !== undefined) o.x = nx; if (ny !== undefined) o.y = ny })
    return o
  }
  return c
})

vi.mock('three/webgpu', () => {
  const MockVector2 = vi.fn(function (this: any, x: number, y: number) {
    this.x = x; this.y = y
    this.set = vi.fn(function (this: any, nx: number, ny: number) { this.x = nx; this.y = ny })
  })
  const MockTexture = vi.fn(function (this: any) {
    this.colorSpace = null; this.minFilter = null; this.magFilter = null
    this.needsUpdate = false; this.image = null; this.dispose = vi.fn()
  })
  return {
    WebGPURenderer: vi.fn(function () {
      return { setPixelRatio: vi.fn(), setSize: vi.fn(), setClearColor: vi.fn(), render: vi.fn(), dispose: vi.fn(), outputColorSpace: null, init: vi.fn(() => Promise.resolve()) }
    }),
    Scene: vi.fn(function () { return { add: vi.fn(), remove: vi.fn(), children: [] as any[] } }),
    OrthographicCamera: vi.fn(function () {
      return { position: { set: vi.fn() }, lookAt: vi.fn(), updateProjectionMatrix: vi.fn(), left: 0, right: 0, top: 0, bottom: 0 }
    }),
    Mesh: vi.fn(function (this: any, geo: any, mat: any) {
      this.geometry = geo; this.material = mat; this.frustumCulled = true
      this.position = { set: vi.fn(), x: 0, y: 0, z: 0 }
      this.scale = { set: vi.fn(), x: 1, y: 1, z: 1 }
    }),
    PlaneGeometry: vi.fn(function () { return { dispose: vi.fn() } }),
    Vector2: MockVector2 as any,
    Texture: MockTexture as any,
    TextureLoader: vi.fn(function () {
      this.load = vi.fn((_url: string, onLoad?: (tex: any) => void, _onProgress?: any, onError?: (err: any) => void) => {
        capturedTextureLoader.onLoad = onLoad ?? null
        capturedTextureLoader.onError = onError ?? null
      })
    }),
    SRGBColorSpace: 'srgb', LinearFilter: 9729, NearestFilter: 9728,
    MeshBasicNodeMaterial: vi.fn(function (this: any, opts: any) {
      this.fragmentNode = opts?.fragmentNode
      this.transparent = opts?.transparent ?? false
      this.dispose = vi.fn()
      this.needsUpdate = false
    }),
  }
})

vi.mock('three/tsl', () => {
  const c = chainable
  return {
    Fn: vi.fn((bodyFn: () => any) => { const result = bodyFn?.(); return () => result ?? c() }) as any,
    If: vi.fn(),
    texture: vi.fn(() => c()),
    uv: vi.fn(() => c()),
    screenCoordinate: c(),
    uniform: vi.fn((val: any) => { const o = c(val); o.value = val ?? 0; o.set = vi.fn(); return o }),
    vec2: vi.fn(() => c()),
    vec3: vi.fn(() => c()),
    vec4: vi.fn(() => c()),
    float: vi.fn(() => c()),
    floor: vi.fn(() => c()),
    max: vi.fn(() => c()),
    mix: vi.fn(() => c()),
    length: vi.fn(() => c()),
    mod: vi.fn(() => c()),
    glslFn: vi.fn(() => vi.fn(() => c())),
    select: vi.fn(() => c()),
  }
})

import { getDitherRevealManager } from '@/lib/ditherRevealManager'

let manager: ReturnType<typeof getDitherRevealManager>

beforeEach(() => {
  capturedTextureLoader.onLoad = null
  capturedTextureLoader.onError = null

  manager = getDitherRevealManager()
  if ((manager as any).initialized) {
    manager.destroy()
  }
})

afterEach(() => {
  manager.destroy()
})

function makeEl(): HTMLElement {
  const el = document.createElement('div')
  el.style.width = '200px'
  el.style.height = '200px'
  document.body.append(el)
  return el
}

describe('ditherRevealManager', () => {
  describe('getDitherRevealManager', () => {
    it('returns a singleton', () => {
      const m2 = getDitherRevealManager()
      expect(manager).toBe(m2)
    })
  })

  describe('register', () => {
    it('registers a block and returns play control', () => {
      const el = makeEl()
      const controls = manager.register('block-1', el, { src: 'img.jpg' })

      expect(controls).toHaveProperty('play')
      expect(typeof controls.play).toBe('function')
      expect(manager.hasBlock('block-1')).toBe(true)
      el.remove()
    })

    it('initializes on first register', () => {
      expect((manager as any).initialized).toBe(false)

      const el = makeEl()
      manager.register('block-1', el, { src: 'img.jpg' })

      expect((manager as any).initialized).toBe(true)
      expect((manager as any).renderer).not.toBeNull()
      expect((manager as any).scene).not.toBeNull()
      el.remove()
    })

    it('applies default options', () => {
      const el = makeEl()
      manager.register('b1', el, { src: 'img.jpg' })

      const block = (manager as any).blocks.get('b1')
      expect(block.options.pxSizeStart).toBe(24)
      expect(block.options.pxSizeEnd).toBe(1)
      expect(block.options.ditherPx).toBe(1)
      expect(block.options.duration).toBe(1600)
      expect(block.options.easing).toBeInstanceOf(Function)
      expect(block.options.useAlpha).toBe(false)
      expect(block.options.pixelationSteps).toEqual([])
      el.remove()
    })

    it('uses provided options', () => {
      const el = makeEl()
      manager.register('b1', el, {
        src: 'custom.jpg',
        pxSizeStart: 48,
        pxSizeEnd: 2,
        ditherPx: 2,
        duration: 3000,
        useAlpha: true,
        pixelationSteps: [32, 16, 8],
      })

      const block = (manager as any).blocks.get('b1')
      expect(block.options.src).toBe('custom.jpg')
      expect(block.options.pxSizeStart).toBe(48)
      expect(block.options.pxSizeEnd).toBe(2)
      expect(block.options.ditherPx).toBe(2)
      expect(block.options.duration).toBe(3000)
      expect(block.options.useAlpha).toBe(true)
      expect(block.options.pixelationSteps).toEqual([32, 16, 8])
      el.remove()
    })

    it('starts loading texture', () => {
      const el = makeEl()
      manager.register('b1', el, { src: 'tex.jpg' })

      expect(capturedTextureLoader.onLoad).toBeInstanceOf(Function)
      el.remove()
    })

    it('assigns loaded texture to block texture', () => {
      const el = makeEl()
      manager.register('b1', el, { src: 'tex.jpg' })

      const mockTex = { image: { width: 512, height: 256 }, colorSpace: 'srgb', minFilter: 9729, magFilter: 9729, dispose: vi.fn() }
      capturedTextureLoader.onLoad?.(mockTex)

      const block = (manager as any).blocks.get('b1')
      expect(block.texture).toBe(mockTex)
      expect(block.texture.image).toBe(mockTex.image)
      expect(block.texture.colorSpace).toBe('srgb')
      expect(block.texture.minFilter).toBe(9729)
      expect(block.texture.magFilter).toBe(9729)
      el.remove()
    })

    it('does not update texture for unregistered block', () => {
      const el = makeEl()
      manager.register('b1', el, { src: 'tex.jpg' })
      manager.unregister('b1')

      const mockTex = { image: {} }
      expect(() => capturedTextureLoader.onLoad?.(mockTex)).not.toThrow()
      el.remove()
    })
  })

  describe('unregister', () => {
    it('removes block from map', () => {
      const el = makeEl()
      manager.register('b1', el, { src: 'img.jpg' })
      expect(manager.hasBlock('b1')).toBe(true)

      manager.unregister('b1')
      expect(manager.hasBlock('b1')).toBe(false)
      el.remove()
    })

    it('does nothing for unknown id', () => {
      expect(() => manager.unregister('unknown')).not.toThrow()
    })
  })

  describe('hasBlock', () => {
    it('returns false for unknown id', () => {
      expect(manager.hasBlock('nope')).toBe(false)
    })

    it('returns true for registered block', () => {
      const el = makeEl()
      manager.register('b1', el, { src: 'img.jpg' })
      expect(manager.hasBlock('b1')).toBe(true)
      el.remove()
    })
  })

  describe('destroy', () => {
    it('cleans up all blocks', () => {
      const el1 = makeEl()
      const el2 = makeEl()
      manager.register('b1', el1, { src: 'a.jpg' })
      manager.register('b2', el2, { src: 'b.jpg' })
      expect((manager as any).blocks.size).toBe(2)

      manager.destroy()
      expect((manager as any).blocks.size).toBe(0)
      el1.remove()
      el2.remove()
    })

    it('sets initialized to false', () => {
      const el = makeEl()
      manager.register('b1', el, { src: 'a.jpg' })
      expect((manager as any).initialized).toBe(true)

      manager.destroy()
      expect((manager as any).initialized).toBe(false)
      el.remove()
    })
  })

  describe('play', () => {
    it('starts the animation for a block', () => {
      const el = makeEl()
      const { play } = manager.register('b1', el, { src: 'img.jpg' })

      const block = (manager as any).blocks.get('b1')
      expect(block.isPlaying).toBe(false)
      expect(block.isDone).toBe(false)

      play()
      expect(block.isPlaying).toBe(true)
      expect(block.isDone).toBe(false)
      expect(block.fadeStart).toBe(0)
      el.remove()
    })

    it('stores onDone callback', () => {
      const el = makeEl()
      const { play } = manager.register('b1', el, { src: 'img.jpg' })

      const onDone = vi.fn()
      play(onDone)

      const block = (manager as any).blocks.get('b1')
      expect(block.onDone).toBe(onDone)
      el.remove()
    })
  })

  describe('renderFrame', () => {
    function prime() {
      const el = makeEl()
      const controls = manager.register('b1', el, { src: 'img.jpg' })
      type Internals = {
        ready: boolean
        dpr: number
        ctx2d: { clearRect: ReturnType<typeof vi.fn>; drawImage: ReturnType<typeof vi.fn> }
        renderer: { render: ReturnType<typeof vi.fn> }
        renderFrame(): void
        onResize(): void
      }
      const m = manager as unknown as Internals
      m.ready = true
      m.ctx2d = { clearRect: vi.fn(), drawImage: vi.fn(), getImageData: vi.fn(() => ({ data: [0, 0, 0, 0] })) }
      const render = m.renderer.render
      return { el, controls, m, render }
    }

    it('overlay canvas is not created with willReadFrequently', () => {
      const el = makeEl()
      const spy = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
      manager.register('b1', el, { src: 'img.jpg' })
      const call2d = spy.mock.calls.find(([kind]) => kind === '2d')
      expect(call2d).toBeDefined()
      expect((call2d?.[1] as CanvasRenderingContext2DSettings | undefined)?.willReadFrequently).toBeFalsy()
      spy.mockRestore()
      el.remove()
    })

    it('renders once after init, then skips frames while idle and unchanged', () => {
      const { el, m, render } = prime()

      m.renderFrame()
      expect(render).toHaveBeenCalledTimes(1)

      m.renderFrame()
      m.renderFrame()
      expect(render).toHaveBeenCalledTimes(1)
      el.remove()
    })

    it('renders every frame while a block is playing', () => {
      const { el, controls, m, render } = prime()
      m.renderFrame()
      render.mockClear()

      controls.play()
      m.renderFrame()
      m.renderFrame()
      expect(render).toHaveBeenCalledTimes(2)
      el.remove()
    })

    it('renders when a block element moved', () => {
      const { el, m, render } = prime()
      m.renderFrame()
      render.mockClear()

      m.renderFrame()
      expect(render).not.toHaveBeenCalled()

      el.getBoundingClientRect = () => ({ left: 50, top: 70, width: 200, height: 200 }) as DOMRect
      m.renderFrame()
      expect(render).toHaveBeenCalledTimes(1)

      m.renderFrame()
      expect(render).toHaveBeenCalledTimes(1)
      el.remove()
    })

    it('renders after resize', () => {
      const { el, m, render } = prime()
      m.renderFrame()
      render.mockClear()

      m.onResize()
      m.renderFrame()
      expect(render).toHaveBeenCalledTimes(1)
      el.remove()
    })

    it('renders after unregister so the block is erased', () => {
      const { el, m, render } = prime()
      m.renderFrame()
      render.mockClear()

      manager.unregister('b1')
      m.renderFrame()
      expect(render).toHaveBeenCalledTimes(1)
      el.remove()
    })
  })

  describe('clipping', () => {
    function rect(left: number, top: number, width: number, height: number) {
      return () => ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect
    }

    function setup(overflow: string) {
      const parent = document.createElement('div')
      parent.style.overflow = overflow
      parent.getBoundingClientRect = rect(100, 100, 300, 200)
      Object.defineProperty(parent, 'clientWidth', { value: 285, configurable: true })
      Object.defineProperty(parent, 'clientHeight', { value: 200, configurable: true })
      Object.defineProperty(parent, 'clientLeft', { value: 0, configurable: true })
      Object.defineProperty(parent, 'clientTop', { value: 0, configurable: true })
      document.body.append(parent)

      const el = document.createElement('div')
      el.getBoundingClientRect = rect(150, 150, 400, 300)
      parent.append(el)

      manager.register('b1', el, { src: 'img.jpg' })
      const m = manager as unknown as {
        ready: boolean
        dpr: number
        ctx2d: { clearRect: ReturnType<typeof vi.fn>; drawImage: ReturnType<typeof vi.fn> }
        renderFrame(): void
        blocks: Map<string, { clipAncestors: HTMLElement[] }>
      }
      m.ready = true
      m.dpr = 1
      m.ctx2d = { clearRect: vi.fn(), drawImage: vi.fn() }
      return { parent, el, m }
    }

    it('collects ancestors with non-visible overflow', () => {
      const { parent, m } = setup('hidden')
      expect(m.blocks.get('b1')!.clipAncestors).toEqual([parent])
      parent.remove()
    })

    it('ignores ancestors with visible overflow', () => {
      const { parent, m } = setup('visible')
      expect(m.blocks.get('b1')!.clipAncestors).toEqual([])
      parent.remove()
    })

    it('draws only the part of the block inside the clipping ancestor client box', () => {
      const { parent, m } = setup('auto')
      m.renderFrame()

      expect(m.ctx2d.drawImage).toHaveBeenCalledTimes(1)
      const args = m.ctx2d.drawImage.mock.calls[0]!
      // block 150..550 x 150..450, parent client box 100..385 x 100..300 → 150..385 x 150..300
      expect(args.slice(1)).toEqual([150, 150, 235, 150, 150, 150, 235, 150])
      parent.remove()
    })

    it('draws nothing when the block is fully clipped', () => {
      const { parent, el, m } = setup('hidden')
      el.getBoundingClientRect = rect(1000, 1000, 50, 50)
      m.renderFrame()

      expect(m.ctx2d.drawImage).not.toHaveBeenCalled()
      parent.remove()
    })

    it('re-renders when only the clip box changed', () => {
      const { parent, m } = setup('hidden')
      m.renderFrame()
      m.ctx2d.drawImage.mockClear()

      m.renderFrame()
      expect(m.ctx2d.drawImage).not.toHaveBeenCalled()

      Object.defineProperty(parent, 'clientWidth', { value: 150, configurable: true })
      m.renderFrame()
      expect(m.ctx2d.drawImage).toHaveBeenCalledTimes(1)
      expect(m.ctx2d.drawImage.mock.calls[0]!.slice(1)).toEqual([150, 150, 100, 150, 150, 150, 100, 150])
      parent.remove()
    })
  })

  describe('getPixelationValue', () => {
    function makeBlock(options: any) {
      return { options }
    }

    it('interpolates between pxSizeStart and pxSizeEnd', () => {
      const block = makeBlock({ pxSizeStart: 24, pxSizeEnd: 1, pixelationSteps: [] })

      expect((manager as any).getPixelationValue(block, 0)).toBe(24)
      expect((manager as any).getPixelationValue(block, 0.5)).toBeCloseTo(12.5)
      expect((manager as any).getPixelationValue(block, 1)).toBe(1)
    })

    it('uses pixelationSteps when provided', () => {
      const block = makeBlock({ pxSizeStart: 24, pxSizeEnd: 1, pixelationSteps: [32, 16, 8, 4, 2] })

      expect((manager as any).getPixelationValue(block, 0)).toBe(32)
      expect((manager as any).getPixelationValue(block, 0.19)).toBe(32)
      expect((manager as any).getPixelationValue(block, 0.2)).toBe(16)
      expect((manager as any).getPixelationValue(block, 0.4)).toBe(8)
      expect((manager as any).getPixelationValue(block, 0.6)).toBe(4)
      expect((manager as any).getPixelationValue(block, 0.8)).toBe(2)
      expect((manager as any).getPixelationValue(block, 1)).toBe(2)
    })

    it('clamps pixelationSteps index to last element', () => {
      const block = makeBlock({ pxSizeStart: 24, pxSizeEnd: 1, pixelationSteps: [10, 5] })

      expect((manager as any).getPixelationValue(block, 1)).toBe(5)
      expect((manager as any).getPixelationValue(block, 2)).toBe(5)
    })
  })

  describe('easing default', () => {
    it('default easing is t*t', () => {
      const el = makeEl()
      manager.register('b1', el, { src: 'img.jpg' })

      const block = (manager as any).blocks.get('b1')
      const ease = block.options.easing

      expect(ease(0)).toBe(0)
      expect(ease(0.5)).toBe(0.25)
      expect(ease(1)).toBe(1)
      el.remove()
    })

    it('accepts custom easing function', () => {
      const el = makeEl()
      const customEase = vi.fn((t: number) => t)
      manager.register('b1', el, { src: 'img.jpg', easing: customEase })

      const block = (manager as any).blocks.get('b1')
      expect(block.options.easing).toBe(customEase)
      el.remove()
    })
  })
})
