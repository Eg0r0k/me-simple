import { nextTick } from 'vue'
import type { Router } from 'vue-router'

export interface ScrollHost {
  get: () => number
  set: (position: number) => void
}

// Позиции прокрутки по полному пути: уход со страницы запоминает, приход восстанавливает.
export function createScrollMemory() {
  const positions = new Map<string, number>()

  return {
    save(path: string, position: number) {
      positions.set(path, position)
    },
    restore(path: string): number {
      return positions.get(path) ?? 0
    },
  }
}

// Ставить позицию можно только когда новая страница уже разложена браузером:
// nextTick приходит раньше, до layout, и значение обрезается по высоте старой страницы.
function afterPaint(callback: () => void) {
  if (typeof requestAnimationFrame === 'undefined') {
    void nextTick(callback)
    return
  }
  requestAnimationFrame(() => requestAnimationFrame(callback))
}

// Окно не прокручивается, прокручивается контейнер Scrollable, поэтому
// scrollBehavior роутера бесполезен: позицию ведём сами через хост контейнера.
export function useScrollMemory(router: Router, host: () => ScrollHost | null) {
  const memory = createScrollMemory()

  router.beforeEach((_to, from) => {
    const current = host()
    if (current && from.matched.length > 0) {
      memory.save(from.fullPath, current.get())
    }
  })

  router.afterEach((to) => {
    afterPaint(() => host()?.set(memory.restore(to.fullPath)))
  })

  return memory
}
