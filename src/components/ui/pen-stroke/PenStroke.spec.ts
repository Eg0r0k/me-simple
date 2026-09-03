import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { PenStroke } from '.'

describe('PenStroke', () => {
  it('оборачивает текст и рисует один путь', () => {
    const wrapper = mount(PenStroke, { slots: { default: 'дня' } })
    const root = wrapper.get('span.pen-stroke')
    expect(root.text()).toBe('дня')
    expect(root.findAll('svg path')).toHaveLength(1)
    expect(root.get('svg').attributes('aria-hidden')).toBe('true')
  })

  it('без IntersectionObserver штрих показан сразу', () => {
    const wrapper = mount(PenStroke, { slots: { default: 'дня' } })
    expect(wrapper.get('span.pen-stroke').classes()).toContain('pen-stroke-drawn')
  })
})
