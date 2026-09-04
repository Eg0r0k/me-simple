import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import CopyEmail from './CopyEmail.vue'

const i18n = createI18n({ legacy: false, locale: 'ru', messages: { ru: { contact: { copied: 'Скопировано' } } } })
const mountEmail = () => mount(CopyEmail, { props: { email: 'a@b.c' }, global: { plugins: [i18n] } })

describe('CopyEmail', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('копирует адрес, показывает галочку на 1.4 с и объявляет это скринридеру', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = mountEmail()
    await wrapper.get('button').trigger('click')
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('a@b.c'))
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.get('[data-icon="check"]').classes()).toContain('opacity-100')
    expect(wrapper.get('[data-icon="copy"]').classes()).toContain('opacity-0')
    expect(wrapper.get('.sr-only').text()).toBe('Скопировано')
    expect(wrapper.text().replace(/Скопировано/, '')).not.toContain('Скопировано')
    await vi.advanceTimersByTimeAsync(1400)
    expect(wrapper.get('[data-icon="check"]').classes()).toContain('opacity-0')
    expect(wrapper.get('[data-icon="copy"]').classes()).toContain('opacity-100')
  })

  it('без clipboard клик ничего не ломает', async () => {
    vi.stubGlobal('navigator', {})
    const wrapper = mountEmail()
    await expect(wrapper.get('button').trigger('click')).resolves.toBeUndefined()
    expect(wrapper.get('[data-icon="check"]').classes()).toContain('opacity-0')
  })

  it('если writeText отклоняется, галочка не показывается и исключения нет', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    const wrapper = mountEmail()
    await expect(wrapper.get('button').trigger('click')).resolves.toBeUndefined()
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith('a@b.c'))
    expect(wrapper.get('[data-icon="check"]').classes()).toContain('opacity-0')
  })
})
