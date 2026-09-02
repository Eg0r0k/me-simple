import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DitherRevealImage from '@/components/DitherRevealImage.vue'

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

beforeEach(() => {
  mockPlay.mockReset()
  mockRegister.mockReset()
  mockUnregister.mockReset()
  mockRegister.mockReturnValue({ play: mockPlay })

  class MockObserver {
    observe = vi.fn()
    disconnect = vi.fn()
    unobserve = vi.fn()
    constructor(_cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {}
  }

  vi.stubGlobal('IntersectionObserver', MockObserver)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('DitherRevealImage', () => {
  it('renders with required src prop', () => {
    const wrapper = mount(DitherRevealImage, { props: { src: '/test.jpg' } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/test.jpg')
  })

  it('renders with default props', () => {
    const wrapper = mount(DitherRevealImage, { props: { src: '/test.jpg' } })
    expect(wrapper.find('.dither-reveal').exists()).toBe(true)
    expect(wrapper.find('.dither-reveal__img').exists()).toBe(true)
  })

  it('hides the original img by default so it never flashes before the overlay', () => {
    const wrapper = mount(DitherRevealImage, { props: { src: '/test.jpg' } })
    expect(wrapper.find('img').classes()).toContain('dither-reveal__img--hidden')
  })

  it('keeps the original img visible in useAlpha mode', () => {
    const wrapper = mount(DitherRevealImage, { props: { src: '/test.jpg', useAlpha: true } })
    expect(wrapper.find('img').classes()).not.toContain('dither-reveal__img--hidden')
  })

  it('passes custom props to the manager', () => {
    mount(DitherRevealImage, {
      props: {
        src: '/custom.jpg',
        pxSizeStart: 48,
        pxSizeEnd: 2,
        ditherPx: 2,
        duration: 3000,
        useAlpha: true,
        pixelationSteps: [32, 16, 8, 4, 2, 1],
        playOnVisible: false,
      },
    })

    expect(mockRegister).toHaveBeenCalledTimes(1)
    const opts = mockRegister.mock.calls[0][2]

    expect(opts.src).toBe('/custom.jpg')
    expect(opts.pxSizeStart).toBe(48)
    expect(opts.pxSizeEnd).toBe(2)
    expect(opts.ditherPx).toBe(2)
    expect(opts.duration).toBe(3000)
    expect(opts.useAlpha).toBe(true)
    expect(opts.pixelationSteps).toEqual([32, 16, 8, 4, 2, 1])
  })

  it('registers on mount with the div element', () => {
    mount(DitherRevealImage, { props: { src: '/test.jpg' } })

    expect(mockRegister).toHaveBeenCalledTimes(1)
    const el = mockRegister.mock.calls[0][1]
    expect(el).toBeInstanceOf(HTMLElement)
    expect(el.className).toBe('dither-reveal')
  })

  it('applies aspectRatio from prop', async () => {
    const wrapper = mount(DitherRevealImage, {
      props: { src: '/test.jpg', aspectRatio: 16 / 9 },
    })

    await wrapper.vm.$nextTick()
    const div = wrapper.find('.dither-reveal')
    const style = div.attributes('style')
    expect(style).toContain('aspect-ratio')
  })

  it('does not set aspect ratio style when no ratio provided', () => {
    const wrapper = mount(DitherRevealImage, {
      props: { src: '/test.jpg' },
    })

    const div = wrapper.find('.dither-reveal')
    const style = div.attributes('style')
    expect(style).toBeFalsy()
  })

  it('computes intrinsic ratio from img load', async () => {
    const wrapper = mount(DitherRevealImage, {
      props: { src: '/test.jpg' },
    })

    const img = wrapper.find('img')
    Object.defineProperty(img.element, 'naturalWidth', { value: 1920, configurable: true })
    Object.defineProperty(img.element, 'naturalHeight', { value: 1080, configurable: true })

    await img.trigger('load')

    const div = wrapper.find('.dither-reveal')
    const style = div.attributes('style')
    expect(style).toContain('aspect-ratio')
  })

  it('prefers aspectRatio prop over intrinsic ratio', async () => {
    const wrapper = mount(DitherRevealImage, {
      props: { src: '/test.jpg', aspectRatio: 1 },
    })

    const img = wrapper.find('img')
    Object.defineProperty(img.element, 'naturalWidth', { value: 1920, configurable: true })
    Object.defineProperty(img.element, 'naturalHeight', { value: 1080, configurable: true })

    await img.trigger('load')

    const div = wrapper.find('.dither-reveal')
    const style = div.attributes('style')
    expect(style).toContain('aspect-ratio')
  })

  it('shows replay button when isDone becomes true', async () => {
    mockPlay.mockImplementation((onDone?: () => void) => {
      onDone?.()
    })

    const wrapper = mount(DitherRevealImage, {
      props: { src: '/test.jpg', playOnVisible: false },
    })

    await wrapper.vm.$nextTick()

    const replayBtn = wrapper.find('.dither-reveal__replay')
    expect(replayBtn.exists()).toBe(true)
    expect(replayBtn.text()).toContain('replay')
  })

  it('hides replay button initially', () => {
    const wrapper = mount(DitherRevealImage, {
      props: { src: '/test.jpg', playOnVisible: true },
    })

    expect(wrapper.find('.dither-reveal__replay').exists()).toBe(false)
  })

  it('replay button calls replay', async () => {
    mockPlay.mockImplementation((onDone?: () => void) => {
      onDone?.()
    })

    const wrapper = mount(DitherRevealImage, {
      props: { src: '/test.jpg', playOnVisible: false },
    })

    await wrapper.vm.$nextTick()

    const callsBefore = mockPlay.mock.calls.length
    wrapper.find('.dither-reveal__replay').trigger('click')
    expect(mockPlay.mock.calls.length).toBe(callsBefore + 1)
  })
})
