import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ScoreRing from './ScoreRing.vue'

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

const shownNumber = (wrapper: ReturnType<typeof mount>) => wrapper.get('.t-code').text()

describe('ScoreRing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('ждёт active, потом досчитывает до значения и дорисовывает кольцо', async () => {
    stubMatchMedia(false)
    const wrapper = mount(ScoreRing, {
      props: { value: 99, label: 'Performance', active: false, duration: 200 },
    })
    expect(shownNumber(wrapper)).toBe('0')
    expect(wrapper.findAll('circle')[1]!.attributes('stroke-dashoffset')).toBe('100')

    await wrapper.setProps({ active: true })
    await vi.advanceTimersByTimeAsync(400)

    expect(shownNumber(wrapper)).toBe('99')
    expect(wrapper.findAll('circle')[1]!.attributes('stroke-dashoffset')).toBe('1')
  })

  it('под reduced motion показывает итог сразу', () => {
    stubMatchMedia(true)
    const wrapper = mount(ScoreRing, { props: { value: 100, label: 'SEO', active: true } })
    expect(shownNumber(wrapper)).toBe('100')
    expect(wrapper.findAll('circle')[1]!.attributes('stroke-dashoffset')).toBe('0')
  })

  it('скринридеру отдаёт подпись со значением', () => {
    stubMatchMedia(false)
    const wrapper = mount(ScoreRing, {
      props: { value: 100, label: 'Accessibility', active: false },
    })
    expect(wrapper.attributes('aria-label')).toBe('Accessibility: 100')
  })
})
