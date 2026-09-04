import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HoverNote from './HoverNote.vue'

describe('HoverNote', () => {
  it('с href триггер — это a[href]', () => {
    const wrapper = mount(HoverNote, {
      props: { title: 'Заголовок', href: 'https://example.com' },
      slots: { default: 'текст ссылки' },
    })
    const trigger = wrapper.get('a')
    expect(trigger.attributes('href')).toBe('https://example.com')
  })

  it('без href триггер — это span[tabindex="0"]', () => {
    const wrapper = mount(HoverNote, {
      props: { title: 'Заголовок' },
      slots: { default: 'обычный текст' },
    })
    expect(wrapper.find('a').exists()).toBe(false)
    const trigger = wrapper.get('span[tabindex="0"]')
    expect(trigger.text()).toContain('обычный текст')
  })

  it('текст слота рендерится', () => {
    const wrapper = mount(HoverNote, {
      props: { title: 'Заголовок', href: 'https://example.com' },
      slots: { default: 'фраза с подсказкой' },
    })
    expect(wrapper.text()).toContain('фраза с подсказкой')
  })
})
