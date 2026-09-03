import { describe, it, expect } from 'vitest'
import { buildThemeClipPath } from './clipPath'

describe('buildThemeClipPath', () => {
  // Псевдоэлементы ::view-transition-* живут в своей системе координат, размер
  // которой не обязан совпадать с CSS-пикселями viewport (масштаб страницы).
  // Проценты резолвятся от собственного бокса псевдоэлемента, поэтому один и тот
  // же клик должен давать одну и ту же геометрию при любом масштабе.
  it('даёт одинаковый clip-path для одной точки при разном масштабе', () => {
    const at100 = buildThemeClipPath(960, 40, 1000, 800)
    const at200 = buildThemeClipPath(480, 20, 500, 400)

    expect(at200).toEqual(at100)
  })

  it('стартует из нулевого радиуса в точке клика', () => {
    const { start } = buildThemeClipPath(250, 200, 1000, 800)

    expect(start).toBe('circle(0% at 25% 25%)')
  })

  it('накрывает самый дальний угол viewport', () => {
    // Клик в левом верхнем углу: дальняя точка — правый нижний угол.
    const { end } = buildThemeClipPath(0, 0, 1000, 800)

    const match = /^circle\(([\d.]+)% at 0% 0%\)$/.exec(end)
    expect(match).not.toBeNull()

    // Радиус в % резолвится от sqrt(w² + h²) / sqrt(2).
    const reference = Math.hypot(1000, 800) / Math.SQRT2
    const radiusPx = (Number(match![1]) / 100) * reference

    // Процент округляется до 4 знаков — допускаем субпиксельную погрешность.
    expect(radiusPx).toBeCloseTo(Math.hypot(1000, 800), 2)
  })

  it('не делит на ноль при нулевом viewport', () => {
    const { start, end } = buildThemeClipPath(0, 0, 0, 0)

    expect(start).not.toContain('NaN')
    expect(end).not.toContain('NaN')
  })
})
