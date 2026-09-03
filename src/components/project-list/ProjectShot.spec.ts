import { describe, it, expect } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import type { Project } from '@/data/projects'
import ProjectShot from './ProjectShot.vue'

const StubIcon = defineComponent({ render: () => null })

function makeImageProject(src: Partial<Record<'ru' | 'en', string>>): Project {
  return {
    slug: 'stub',
    title: 'Stub',
    captionKey: 'projects.items.stub',
    year: 2025,
    tone: 'sky',
    icon: StubIcon,
    preview: { kind: 'image', src },
  }
}

const withImage = makeImageProject({ ru: '/ru.webp', en: '/en.webp' })

function makeCommandProject(command: string): Project {
  return {
    slug: 'stub-command',
    title: 'Stub command',
    captionKey: 'projects.items.stubCommand',
    year: 2025,
    tone: 'peri',
    icon: StubIcon,
    preview: { kind: 'command', command },
  }
}

describe('ProjectShot', () => {
  it('для ru рендерит img с ru-кадром и пустым alt', () => {
    const project = makeImageProject({ ru: '/ru.webp', en: '/en.webp' })
    const wrapper = mount(ProjectShot, { props: { project, locale: 'ru' } })

    const img = wrapper.get('img')
    expect(img.attributes('src')).toBe('/ru.webp')
    expect(img.attributes('alt')).toBe('')
  })

  it('для en рендерит img с en-кадром', () => {
    const project = makeImageProject({ ru: '/ru.webp', en: '/en.webp' })
    const wrapper = mount(ProjectShot, { props: { project, locale: 'en' } })

    expect(wrapper.get('img').attributes('src')).toBe('/en.webp')
  })

  it('без ru-кадра при locale ru падает на en', () => {
    const project = makeImageProject({ en: '/en.webp' })
    const wrapper = mount(ProjectShot, { props: { project, locale: 'ru' } })

    expect(wrapper.get('img').attributes('src')).toBe('/en.webp')
  })

  it('плашка с командой рендерит текст команды и тон peri, без img', () => {
    const project = makeCommandProject('npm i x')
    const wrapper = mount(ProjectShot, { props: { project, locale: 'ru' } })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('npm i x')

    const tone = wrapper.get('[class*="bg-peri-soft"]')
    expect(tone.classes()).toContain('bg-peri-soft')
    expect(tone.classes()).toContain('text-peri-ink')
  })

  it('картинка прозрачна до загрузки и проявляется после', async () => {
    const wrapper = mount(ProjectShot, { props: { project: withImage, locale: 'ru' } })
    const img = wrapper.get('img')
    expect(img.classes()).toContain('opacity-0')
    await img.trigger('load')
    expect(img.classes()).toContain('opacity-100')
  })

  it('смена кадра снова прячет картинку до загрузки', async () => {
    const wrapper = mount(ProjectShot, { props: { project: withImage, locale: 'ru' } })
    await wrapper.get('img').trigger('load')
    await wrapper.setProps({ locale: 'en' })
    expect(wrapper.get('img').classes()).toContain('opacity-0')
  })
})
