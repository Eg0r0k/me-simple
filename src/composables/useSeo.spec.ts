import { describe, it, expect } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import { useSeo } from './useSeo'

const Page = defineComponent({
  setup() {
    useSeo({ title: 'Projects — Egor', description: 'Open source projects' })
    return () => h('div')
  },
})

async function mountPage() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/projects', component: Page }],
  })
  await router.push('/projects')
  await router.isReady()

  const i18n = createI18n({
    legacy: false,
    locale: 'ru',
    messages: { ru: { home: { name: 'Егор' } }, en: { home: { name: 'Egor' } } },
  })

  mount(Page, { global: { plugins: [router, i18n, createHead()] } })
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 0))
}

const meta = (selector: string) =>
  document.head.querySelector<HTMLMetaElement>(selector)?.getAttribute('content')

describe('useSeo', () => {
  it('проставляет title, description, canonical и og-теги', async () => {
    await mountPage()

    expect(document.title).toBe('Projects — Egor')
    expect(meta('meta[name="description"]')).toBe('Open source projects')
    expect(meta('meta[property="og:title"]')).toBe('Projects — Egor')
    expect(meta('meta[property="og:site_name"]')).toBe('Егор')
    expect(meta('meta[property="og:locale"]')).toBe('ru_RU')
    expect(meta('meta[name="twitter:card"]')).toBe('summary')

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    expect(canonical?.getAttribute('href')).toBe(`${window.location.origin}/projects`)
    expect(meta('meta[property="og:url"]')).toBe(`${window.location.origin}/projects`)
  })
})
