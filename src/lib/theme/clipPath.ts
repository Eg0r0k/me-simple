export type ThemeClipPath = {
  start: string
  end: string
}

const round = (value: number) => Math.round(value * 1e4) / 1e4

/**
 * Геометрия «круга» для переключения темы через View Transitions.
 *
 * Анимация вешается на ::view-transition-old/new(root) — псевдоэлементы живут в
 * snapshot containing block, чей масштаб не совпадает с CSS-пикселями viewport,
 * когда у страницы включён zoom. Поэтому координаты клика в px там «уезжают»
 * (при увеличении — влево-вверх). Проценты резолвятся от собственного бокса
 * псевдоэлемента, который повторяет пропорции viewport, — так центр и радиус
 * остаются верными при любом масштабе.
 *
 * @param x clientX клика, CSS-px
 * @param y clientY клика, CSS-px
 * @param width ширина viewport, CSS-px
 * @param height высота viewport, CSS-px
 */
export const buildThemeClipPath = (
  x: number,
  y: number,
  width: number,
  height: number,
): ThemeClipPath => {
  const xPercent = width > 0 ? round((x / width) * 100) : 50
  const yPercent = height > 0 ? round((y / height) * 100) : 50

  // Радиус до самого дальнего угла viewport.
  const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
  // Процентный радиус circle() резолвится от sqrt(w² + h²) / sqrt(2).
  const reference = Math.hypot(width, height) / Math.SQRT2
  const radiusPercent = reference > 0 ? round((radius / reference) * 100) : 0

  const at = `at ${xPercent}% ${yPercent}%`

  return {
    start: `circle(0% ${at})`,
    end: `circle(${radiusPercent}% ${at})`,
  }
}
