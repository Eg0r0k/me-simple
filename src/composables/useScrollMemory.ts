import { getCurrentScope, nextTick, onScopeDispose } from 'vue'
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

// Страховка: ставим позицию после отрисовки новой страницы, два кадра спустя;
// без requestAnimationFrame падаем на nextTick.
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

  const stopBefore = router.beforeEach((_to, from) => {
    const current = host()
    if (current && from.matched.length > 0) {
      memory.save(from.fullPath, current.get())
    }
  })

  const stopAfter = router.afterEach((to, _from, failure) => {
    // При дублированной или отменённой навигации страница не меняется: позицию не трогаем.
    if (failure) return
    afterPaint(() => host()?.set(memory.restore(to.fullPath)))
  })

  if (getCurrentScope()) {
    onScopeDispose(() => {
      stopBefore()
      stopAfter()
    })
  }

  return memory
}
