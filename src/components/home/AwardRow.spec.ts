import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AwardRow from './AwardRow.vue'

describe('AwardRow', () => {
  it('без ссылки это article без стрелки', () => {
    const wrapper = mount(AwardRow, { props: { year: 2025, title: 'PROЦИФРУ', subtitle: 'победитель' } })
    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.find('svg').exists()).toBe(false)
    expect(wrapper.text()).toContain('2025')
  })

  it('со ссылкой это a наружу со стрелкой', () => {
    const wrapper = mount(AwardRow, { props: { year: 2024, title: 'Yandex Cup', subtitle: 'полуфиналист', url: 'https://example.com' } })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.find('svg').exists()).toBe(true)
  })
})
