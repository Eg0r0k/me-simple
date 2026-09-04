import { onScopeDispose, ref } from 'vue'

export function formatMoscowTime(date = new Date()) {
  return date.toLocaleTimeString('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Одни часы на шапку и карточку «Москве»: тикают раз в секунду, чтобы минута менялась без задержки.
export function useMoscowTime() {
  const time = ref(formatMoscowTime())
  const timer = setInterval(() => {
    time.value = formatMoscowTime()
  }, 1000)
  onScopeDispose(() => clearInterval(timer), true)
  return { time }
}
