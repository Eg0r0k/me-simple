import { nextTick } from 'vue'

const hasRaf = () => typeof requestAnimationFrame !== 'undefined'

export function nextFrame(callback: () => void) {
  if (!hasRaf()) {
    void nextTick(callback)
    return
  }
  requestAnimationFrame(callback)
}

export function afterPaint(callback: () => void) {
  if (!hasRaf()) {
    void nextTick(callback)
    return
  }
  requestAnimationFrame(() => requestAnimationFrame(callback))
}
