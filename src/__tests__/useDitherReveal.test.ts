import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { useDitherReveal } from '@/composables/useDitherReveal'

const { mockPlay, mockRegister, mockUnregister, mockManager } = vi.hoisted(() => {
  const play = vi.fn()
  const register = vi.fn(() => ({ play }))
  const unregister = vi.fn()
  return {
    mockPlay: play,
    mockRegister: register,
    mockUnregister: unregister,
    mockManager: { register, unregister },
  }
})

vi.mock('@/lib/ditherRevealManager', () => ({
  getDitherRevealManager: () => mockManager,
}))

let intersectionCallback:
  | ((entries: Partial<IntersectionObserverEntry>[]) => void)
  | null = null

beforeEach(() => {
  mockPlay.mockReset()
  mockRegister.mockReset()
  mockUnregister.mockReset()
  mockRegister.mockReturnValue({ play: mockPlay })
  intersectionCallback = null

  class MockObserver {
    readonly callback: (entries: Partial<IntersectionObserverEntry>[]) => void
    constructor(cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
      this.callback = cb
      intersectionCallback = cb
    }
    observe = vi.fn()
    disconnect = vi.fn()
    unobserve = vi.fn()
  }

  vi.stubGlobal('IntersectionObserver', MockObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function createTestComponent(options: { src: string; playOnVisible?: boolean }) {
  return defineComponent({
    setup() {
      const elRef = ref<HTMLElement | null>(null)
      const result = useDitherReveal(elRef, options)
      return { elRef, ...result }
    },
    template: '<div ref="elRef" style="width:100px;height:100px"></div>',
  })
}

describe('useDitherReveal', () => {
  it('returns correct shape', () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const elRef = ref<HTMLElement | null>(null)
          const result = useDitherReveal(elRef, { src: 'img.jpg' })
          return { elRef, ...result }
        },
        template: '<div ref="elRef"></div>',
      }),
    )

    const vm = wrapper.vm as unknown as {
      isPlaying: boolean
      isDone: boolean
      play: () => void
      replay: () => void
    }

    expect(vm.isPlaying).toBe(false)
    expect(vm.isDone).toBe(false)
    expect(typeof vm.play).toBe('function')
    expect(typeof vm.replay).toBe('function')
  })

  it('registers on mount with correct options', () => {
    mount(createTestComponent({ src: 'test.jpg', playOnVisible: true }))

    expect(mockRegister).toHaveBeenCalledTimes(1)
    const [id, el, opts] = mockRegister.mock.calls[0]
    expect(id).toMatch(/^dither-\d+$/)
    expect(el).toBeInstanceOf(HTMLElement)
    expect(opts.src).toBe('test.jpg')
  })

  it('calls play when IntersectionObserver triggers', () => {
    mount(createTestComponent({ src: 'test.jpg', playOnVisible: true }))

    expect(intersectionCallback).not.toBeNull()
    intersectionCallback!([{ isIntersecting: true }])

    expect(mockPlay).toHaveBeenCalledTimes(1)
  })

  it('does not call play until IntersectionObserver triggers', () => {
    mount(createTestComponent({ src: 'test.jpg', playOnVisible: true }))

    expect(mockPlay).not.toHaveBeenCalled()
  })

  it('calls play immediately when playOnVisible is false', () => {
    mount(createTestComponent({ src: 'test.jpg', playOnVisible: false }))

    expect(mockPlay).toHaveBeenCalledTimes(1)
  })

  it('sets isPlaying=true and isDone=false on play', () => {
    const wrapper = mount(createTestComponent({ src: 'test.jpg', playOnVisible: false }))

    const vm = wrapper.vm as unknown as {
      isPlaying: boolean
      isDone: boolean
    }

    expect(vm.isPlaying).toBe(true)
    expect(vm.isDone).toBe(false)
  })

  it('updates isPlaying/isDone when play callback fires', () => {
    mockPlay.mockImplementation((onDone?: () => void) => {
      onDone?.()
    })

    const wrapper = mount(createTestComponent({ src: 'test.jpg', playOnVisible: false }))

    const vm = wrapper.vm as unknown as {
      isPlaying: boolean
      isDone: boolean
    }

    expect(vm.isPlaying).toBe(false)
    expect(vm.isDone).toBe(true)
  })

  it('unregisters on unmount', () => {
    const wrapper = mount(createTestComponent({ src: 'test.jpg' }))
    wrapper.unmount()

    expect(mockUnregister).toHaveBeenCalledTimes(1)
  })

  it('replay calls play again', () => {
    let calls = 0
    mockPlay.mockImplementation(() => {
      calls++
    })

    const wrapper = mount(createTestComponent({ src: 'test.jpg', playOnVisible: false }))
    expect(calls).toBe(1)

    const vm = wrapper.vm as unknown as { replay: () => void }
    vm.replay()
    expect(calls).toBe(2)

    vm.replay()
    expect(calls).toBe(3)
  })

  it('play and replay are the same function reference', () => {
    const wrapper = mount(
      defineComponent({
        setup() {
          const elRef = ref<HTMLElement | null>(null)
          const result = useDitherReveal(elRef, { src: 'img.jpg', playOnVisible: true })
          return { elRef, ...result }
        },
        template: '<div ref="elRef"></div>',
      }),
    )

    const vm = wrapper.vm as unknown as { play: () => void; replay: () => void }
    expect(vm.play).toBe(vm.replay)
  })

  it('passes managerOpts without playOnVisible', () => {
    mount(createTestComponent({ src: 'test.jpg', playOnVisible: true }))

    const opts = mockRegister.mock.calls[0][2]
    expect(opts).not.toHaveProperty('playOnVisible')
    expect(opts.src).toBe('test.jpg')
  })

  it('generates unique ids for multiple instances', () => {
    const Comp = createTestComponent({ src: 'a.jpg' })
    mount(Comp)

    const Comp2 = createTestComponent({ src: 'b.jpg' })
    mount(Comp2)

    expect(mockRegister).toHaveBeenCalledTimes(2)
    const id1 = mockRegister.mock.calls[0][0]
    const id2 = mockRegister.mock.calls[1][0]
    expect(id1).not.toBe(id2)
  })

  it('does not register if elRef is null on mount', () => {
    mount(
      defineComponent({
        setup() {
          const elRef = ref<HTMLElement | null>(null)
          const result = useDitherReveal(elRef, { src: 'img.jpg' })
          return { elRef, ...result }
        },
        template: '<div></div>',
      }),
    )

    expect(mockRegister).not.toHaveBeenCalled()
    expect(mockPlay).not.toHaveBeenCalled()
  })

  it('disconnects IntersectionObserver after trigger', () => {
    const disconnect = vi.fn()
    class MockObserver {
      readonly callback: (entries: Partial<IntersectionObserverEntry>[]) => void
      constructor(cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
        this.callback = cb
        intersectionCallback = cb
      }
      observe = vi.fn()
      disconnect = disconnect
      unobserve = vi.fn()
    }
    vi.stubGlobal('IntersectionObserver', MockObserver)

    mount(createTestComponent({ src: 'test.jpg', playOnVisible: true }))
    intersectionCallback!([{ isIntersecting: true }])

    expect(disconnect).toHaveBeenCalledTimes(1)
  })
})
