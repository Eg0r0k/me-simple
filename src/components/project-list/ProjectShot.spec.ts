import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
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
const onlyEn = makeImageProject({ en: '/en.webp' })

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

  it('при смене кадра старый остаётся, пока новый не загрузился', async () => {
    const wrapper = mount(ProjectShot, { props: { project: withImage, locale: 'ru' } })
    await wrapper.get('img').trigger('load')
    await wrapper.setProps({ locale: 'en' })
    const imgs = wrapper.findAll('img')
    expect(imgs).toHaveLength(2)
    expect(imgs[0]!.attributes('src')).toContain('ru')
    expect(imgs[0]!.classes()).toContain('opacity-100')
    expect(imgs[1]!.attributes('src')).toContain('en')
    expect(imgs[1]!.classes()).toContain('opacity-0')
  })

  it('ошибка загрузки нового кадра убирает его, остаётся старый', async () => {
    const wrapper = mount(ProjectShot, { props: { project: withImage, locale: 'ru' } })
    await wrapper.get('img').trigger('load')
    await wrapper.setProps({ locale: 'en' })
    const imgs = wrapper.findAll('img')
    expect(imgs).toHaveLength(2)

    await imgs[1]!.trigger('error')

    const remaining = wrapper.findAll('img')
    expect(remaining).toHaveLength(1)
    expect(remaining[0]!.attributes('src')).toContain('ru')
  })

  describe('после загрузки нового кадра', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('новый проявляется, старый удаляется через --dur-reveal', async () => {
      const wrapper = mount(ProjectShot, { props: { project: withImage, locale: 'ru' } })
      await wrapper.get('img').trigger('load')
      await wrapper.setProps({ locale: 'en' })
      await wrapper.findAll('img')[1]!.trigger('load')
      expect(wrapper.findAll('img')[1]!.classes()).toContain('opacity-100')
      vi.advanceTimersByTime(300)
      await nextTick()
      const imgs = wrapper.findAll('img')
      expect(imgs).toHaveLength(1)
      expect(imgs[0]!.attributes('src')).toContain('en')
    })
  })

  it('тот же кадр на другом языке не создаёт второй слой', async () => {
    const wrapper = mount(ProjectShot, { props: { project: onlyEn, locale: 'ru' } })
    await wrapper.setProps({ locale: 'en' })
    expect(wrapper.findAll('img')).toHaveLength(1)
  })

  it('быстрое переключение туда-обратно не плодит дублирующиеся слои', async () => {
    const wrapper = mount(ProjectShot, { props: { project: withImage, locale: 'ru' } })
    await wrapper.get('img').trigger('load')
    await wrapper.setProps({ locale: 'en' })
    await wrapper.setProps({ locale: 'ru' })
    const imgs = wrapper.findAll('img')
    expect(imgs).toHaveLength(1)
    expect(imgs[0]!.attributes('src')).toContain('ru')
    expect(imgs[0]!.classes()).toContain('opacity-100')
  })
})
