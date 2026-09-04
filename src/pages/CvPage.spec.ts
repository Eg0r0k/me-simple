import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createHead } from '@unhead/vue/client'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import { messages } from '@/app/i18n/messages'
import CvPage from './CvPage.vue'

async function mountCv(locale: 'ru' | 'en') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/cv', name: 'cv', component: CvPage },
    ],
  })
  await router.push('/cv')
  await router.isReady()
  const i18n = createI18n({ legacy: false, locale, messages })
  return mount(CvPage, {
    global: { plugins: [router, i18n, createHead()], stubs: { RouterLink: true } },
  })
}

describe('CvPage', () => {
  it('рендерит все места работы с буллетами из локали', async () => {
    const wrapper = await mountCv('ru')
    const jobs = wrapper.findAll('[data-slot=cv-job]')
    expect(jobs).toHaveLength(3)
    expect(jobs[1]!.text()).toContain('Code Masters')
    expect(jobs[1]!.findAll('li')).toHaveLength(6)
    expect(wrapper.text()).toContain('Английский — B1')
  })

  it('переключается на английский', async () => {
    const wrapper = await mountCv('en')
    expect(wrapper.text()).toContain('Save as PDF')
    expect(wrapper.text()).toContain('English — B1')
    expect(wrapper.text()).toContain('lyra-audio')
  })
})
