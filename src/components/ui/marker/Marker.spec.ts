import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Marker } from '.'

describe('Marker', () => {
  it('рендерит mark с текстом слота', () => {
    const wrapper = mount(Marker, { slots: { default: 'дня' } })
    const mark = wrapper.get('mark')
    expect(mark.classes()).toContain('marker')
    expect(mark.text()).toBe('дня')
  })

  it('без IntersectionObserver подложка показана сразу', () => {
    // В jsdom IntersectionObserver нет: рисовать нечем, значит, показываем без анимации.
    const wrapper = mount(Marker, { slots: { default: 'дня' } })
    expect(wrapper.get('mark').classes()).toContain('marker-drawn')
  })
})
