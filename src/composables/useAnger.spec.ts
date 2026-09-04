import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ANGER_STEP, COOL_INTERVAL_MS, COOL_STEP, useAnger } from './useAnger'

describe('useAnger', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('один клик поднимает злость на ANGER_STEP', () => {
    const { level, poke } = useAnger()
    poke()
    expect(level.value).toBeCloseTo(ANGER_STEP)
  })

  it('не злится выше единицы', () => {
    const { level, poke } = useAnger()
    for (let i = 0; i < Math.ceil(1 / ANGER_STEP) + 1; i++) poke()
    expect(level.value).toBe(1)
  })

  it('после одного клика остывает за четыре секунды', () => {
    const { level, poke } = useAnger()
    poke()
    const halfway = Math.floor(ANGER_STEP / COOL_STEP / 2) * COOL_INTERVAL_MS
    vi.advanceTimersByTime(halfway)
    expect(level.value).toBeGreaterThan(0)
    const rest = Math.ceil(ANGER_STEP / COOL_STEP) * COOL_INTERVAL_MS
    vi.advanceTimersByTime(rest)
    expect(level.value).toBe(0)
  })

  it('каждый клик перезапускает тряску', () => {
    const { shakeKey, poke } = useAnger()
    poke()
    poke()
    expect(shakeKey.value).toBe(2)
  })

  it('после полного остывания не остаётся таймеров', () => {
    const { level, poke } = useAnger()
    poke()
    vi.advanceTimersByTime(Math.ceil(ANGER_STEP / COOL_STEP) * COOL_INTERVAL_MS)
    expect(level.value).toBe(0)
    expect(vi.getTimerCount()).toBe(0)
  })
})
