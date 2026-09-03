import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAnger } from './useAnger'

describe('useAnger', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('один клик поднимает злость на 0.2', () => {
    const { level, poke } = useAnger()
    poke()
    expect(level.value).toBeCloseTo(0.2)
  })

  it('не злится выше единицы', () => {
    const { level, poke } = useAnger()
    for (let i = 0; i < 7; i++) poke()
    expect(level.value).toBe(1)
  })

  it('после одного клика остывает за четыре секунды', () => {
    const { level, poke } = useAnger()
    poke()
    vi.advanceTimersByTime(2000)
    expect(level.value).toBeGreaterThan(0)
    vi.advanceTimersByTime(2100)
    expect(level.value).toBe(0)
  })

  it('каждый клик перезапускает тряску', () => {
    const { shakeKey, poke } = useAnger()
    poke()
    poke()
    expect(shakeKey.value).toBe(2)
  })
})
