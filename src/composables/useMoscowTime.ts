import { createSharedComposable } from '@vueuse/core'
import { onScopeDispose, ref } from 'vue'

export function formatMoscowTime(date = new Date()) {
  return date.toLocaleTimeString('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function createMoscowTime() {
  const time = ref(formatMoscowTime())
  const timer = setInterval(() => {
    time.value = formatMoscowTime()
  }, 1000)
  onScopeDispose(() => clearInterval(timer), true)
  return { time }
}

export const useMoscowTime = createSharedComposable(createMoscowTime)
