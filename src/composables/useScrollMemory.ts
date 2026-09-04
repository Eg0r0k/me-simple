import { getCurrentScope, onScopeDispose } from 'vue'
import type { Router } from 'vue-router'
import { afterPaint } from '@/lib/frame'

export interface ScrollHost {
  get: () => number
  set: (position: number) => void
}

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

// Прокручивается контейнер Scrollable, а не окно, поэтому scrollBehavior роутера не подходит.
export function useScrollMemory(router: Router, host: () => ScrollHost | null) {
  const memory = createScrollMemory()

  const stopBefore = router.beforeEach((_to, from) => {
    const current = host()
    if (current && from.matched.length > 0) {
      memory.save(from.fullPath, current.get())
    }
  })

  const stopAfter = router.afterEach((to, _from, failure) => {
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
