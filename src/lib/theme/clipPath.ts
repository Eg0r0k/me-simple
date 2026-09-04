import { roundTo } from '@/lib/math'

export type ThemeClipPath = {
  start: string
  end: string
}

// Проценты, а не px: при zoom страницы ::view-transition-*(root) живёт в другом масштабе.
export const buildThemeClipPath = (
  x: number,
  y: number,
  width: number,
  height: number,
): ThemeClipPath => {
  const xPercent = width > 0 ? roundTo((x / width) * 100) : 50
  const yPercent = height > 0 ? roundTo((y / height) * 100) : 50

  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
  const reference = Math.hypot(width, height) / Math.SQRT2
  const radiusPercent = reference > 0 ? roundTo((radius / reference) * 100) : 0

  const at = `at ${xPercent}% ${yPercent}%`

  return {
    start: `circle(0% ${at})`,
    end: `circle(${radiusPercent}% ${at})`,
  }
}
