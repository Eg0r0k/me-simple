import type { PreviewLocale, ProjectPreview } from '@/data/projects'

export const CARD_WIDTH = 280
export const CARD_HEIGHT = (CARD_WIDTH * 9) / 16
export const CARD_OFFSET = 20
export const VIEWPORT_MARGIN = 16
export const TILT_FACTOR = 0.004
export const TILT_MAX = 6

export function toPreviewLocale(locale: string): PreviewLocale {
  return locale.startsWith('ru') ? 'ru' : 'en'
}

// Кадр текущего языка, иначе en, иначе первый, который есть. У плашки кадра нет.
export function resolvePreviewSrc(preview: ProjectPreview, locale: PreviewLocale): string | null {
  if (preview.kind !== 'image') return null
  return preview.src[locale] ?? preview.src.en ?? Object.values(preview.src)[0] ?? null
}

// Наклон по горизонтальной скорости пружины, px/s → градусы, не больше ±6.
export function clampTilt(velocity: number): number {
  const raw = velocity * TILT_FACTOR
  return Math.max(-TILT_MAX, Math.min(TILT_MAX, raw))
}

// Карточка стоит справа от курсора, пока её правый край не упирается в поле окна.
export function placeCard(
  pointerX: number,
  cardWidth: number,
  viewportWidth: number,
): 'right' | 'left' {
  const rightEdge = pointerX + CARD_OFFSET + cardWidth
  return rightEdge <= viewportWidth - VIEWPORT_MARGIN ? 'right' : 'left'
}

// Верх карточки: по центру курсора, но не ближе VIEWPORT_MARGIN к краям окна.
export function clampCardY(pointerY: number, cardHeight: number, viewportHeight: number): number {
  const top = pointerY - cardHeight / 2
  const max = viewportHeight - cardHeight - VIEWPORT_MARGIN
  return Math.min(Math.max(top, VIEWPORT_MARGIN), Math.max(VIEWPORT_MARGIN, max))
}
