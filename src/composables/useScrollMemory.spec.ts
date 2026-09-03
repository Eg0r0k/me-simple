import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createScrollMemory, useScrollMemory } from './useScrollMemory'

describe('createScrollMemory', () => {
  it('возвращает сохранённую позицию по пути', () => {
    const memory = createScrollMemory()
    memory.save('/', 480)
    expect(memory.restore('/')).toBe(480)
  })

  it('для незнакомого пути даёт ноль', () => {
    expect(createScrollMemory().restore('/projects')).toBe(0)
  })

  it('перезаписывает позицию при повторном сохранении', () => {
    const memory = createScrollMemory()
    memory.save('/', 100)
    memory.save('/', 250)
    expect(memory.restore('/')).toBe(250)
  })
})

describe('useScrollMemory', () => {
  const Page = { template: '<div />' }

  function setup() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: Page },
        { path: '/projects', component: Page },
      ],
    })
    let position = 0
    const host = { get: () => position, set: vi.fn((p: number) => (position = p)) }
    useScrollMemory(router, () => host)
    return { router, host, scroll: (p: number) => (position = p) }
  }

  it('новая страница открывается сверху', async () => {
    const { router, host, scroll } = setup()
    await router.push('/')
    scroll(600)
    await router.push('/projects')
    await nextTick()
    expect(host.set).toHaveBeenLastCalledWith(0)
  })

  it('возврат на страницу восстанавливает её позицию', async () => {
    const { router, host, scroll } = setup()
    await router.push('/')
    scroll(600)
    await router.push('/projects')
    await nextTick()
    await router.push('/')
    await nextTick()
    expect(host.set).toHaveBeenLastCalledWith(600)
  })

  it('без хоста ничего не делает и не падает', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Page }],
    })
    useScrollMemory(router, () => null)
    await expect(router.push('/')).resolves.toBeUndefined()
  })
})
