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
    // Новая страница появляется в DOM на следующем тике, до этого ставить позицию некуда.
    void nextTick(() => host()?.set(memory.restore(to.fullPath)))
  })

  return memory
}
