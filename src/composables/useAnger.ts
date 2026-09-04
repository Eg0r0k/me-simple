import { onScopeDispose, ref } from 'vue'

export const ANGER_STEP = 0.2
export const COOL_INTERVAL_MS = 100
export const COOL_STEP = 0.005

// Злость растёт от кликов и остывает сама: один клик отпускает примерно за 4 с.
export function useAnger() {
  const level = ref(0)
  const shakeKey = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined

  const stop = () => {
    if (timer !== undefined) {
      clearInterval(timer)
      timer = undefined
    }
  }

  const cool = () => {
    level.value = Math.max(0, Number((level.value - COOL_STEP).toFixed(3)))
    if (level.value === 0) stop()
  }

  const poke = () => {
    level.value = Math.min(1, Number((level.value + ANGER_STEP).toFixed(3)))
    shakeKey.value += 1
    if (timer === undefined) timer = setInterval(cool, COOL_INTERVAL_MS)
  }

  onScopeDispose(stop, true)

  return { level, shakeKey, poke }
}
