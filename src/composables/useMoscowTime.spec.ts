import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { formatMoscowTime, useMoscowTime } from './useMoscowTime'

describe('useMoscowTime', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('форматирует время по Москве как ЧЧ:ММ', () => {
    vi.setSystemTime(new Date('2026-09-04T09:05:00Z'))
    expect(formatMoscowTime()).toBe('12:05')
  })

  it('обновляется, когда проходит минута', () => {
    vi.setSystemTime(new Date('2026-09-04T09:05:30Z'))
    const scope = effectScope()
    const { time } = scope.run(() => useMoscowTime())!
    expect(time.value).toBe('12:05')
    vi.setSystemTime(new Date('2026-09-04T09:06:30Z'))
    vi.advanceTimersByTime(1000)
    expect(time.value).toBe('12:06')
    scope.stop()
  })

  it('останавливает таймер вместе со scope', () => {
    const scope = effectScope()
    scope.run(() => useMoscowTime())
    scope.stop()
    expect(vi.getTimerCount()).toBe(0)
  })
})
