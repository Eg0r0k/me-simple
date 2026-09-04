import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CountUp from './CountUp.vue'

function stubMatchMedia(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  }))
}

describe('CountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // rAF через таймеры, чтобы крутить кадры руками
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(performance.now()), 16))
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('считает от нуля до цели и не дальше', async () => {
    stubMatchMedia(false)
    const wrapper = mount(CountUp, { props: { to: 4, delay: 0, duration: 200 } })
    expect(wrapper.get('[aria-hidden="true"]').text()).toBe('0')
    await vi.advanceTimersByTimeAsync(400)
    expect(wrapper.get('[aria-hidden="true"]').text()).toBe('4')
  })

  it('под reduced motion показывает цель сразу', () => {
    stubMatchMedia(true)
    const wrapper = mount(CountUp, { props: { to: 4 } })
    expect(wrapper.get('[aria-hidden="true"]').text()).toBe('4')
  })

  it('скринридеру отдаёт итог', () => {
    stubMatchMedia(false)
    const wrapper = mount(CountUp, { props: { to: 4 } })
    expect(wrapper.get('.sr-only').text()).toBe('4')
  })
})
