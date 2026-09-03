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

// Восстановление уходит через двойной requestAnimationFrame, поэтому ждём два кадра,
// а не микротаску nextTick — иначе позиция ставится раньше, чем страница разложена.
const twoFrames = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

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
    await twoFrames()
    expect(host.set).toHaveBeenLastCalledWith(0)
  })

  it('возврат на страницу восстанавливает её позицию', async () => {
    const { router, host, scroll } = setup()
    await router.push('/')
    scroll(600)
    await router.push('/projects')
    await twoFrames()
    await router.push('/')
    await twoFrames()
    expect(host.set).toHaveBeenLastCalledWith(600)
  })

  it('дублированная навигация не трогает позицию', async () => {
    const { router, host, scroll } = setup()
    await router.push('/')
    await twoFrames()
    scroll(600)
    const callsBefore = host.set.mock.calls.length
    await router.push('/').catch(() => {})
    await twoFrames()
    expect(host.set.mock.calls.length).toBe(callsBefore)
  })

  it('без хоста ничего не делает и не падает', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: Page }],
    })
    useScrollMemory(router, () => null)
    await expect(router.push('/')).resolves.toBeUndefined()
  })

  it('без requestAnimationFrame восстанавливает через nextTick', async () => {
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

    vi.stubGlobal('requestAnimationFrame', undefined)
    try {
      await router.push('/')
      await nextTick()
      expect(host.set).toHaveBeenLastCalledWith(0)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
