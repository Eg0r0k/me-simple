import type { PreviewLocale, ProjectPreview } from '@/data/projects'
import { clamp } from '@/lib/math'

export const CARD_WIDTH = 280
export const CARD_HEIGHT = (CARD_WIDTH * 9) / 16
export const CARD_OFFSET = 20
export const VIEWPORT_MARGIN = 16
export const TILT_FACTOR = 0.004
export const TILT_MAX = 6

export function toPreviewLocale(locale: string): PreviewLocale {
  return locale.startsWith('ru') ? 'ru' : 'en'
}

export function resolvePreviewSrc(preview: ProjectPreview, locale: PreviewLocale): string | null {
  if (preview.kind !== 'image') return null
  return preview.src[locale] ?? preview.src.en ?? Object.values(preview.src)[0] ?? null
}

export function clampTilt(velocity: number): number {
  return clamp(velocity * TILT_FACTOR, -TILT_MAX, TILT_MAX)
}

export function placeCard(
  pointerX: number,
  cardWidth: number,
  viewportWidth: number,
): 'right' | 'left' {
  const rightEdge = pointerX + CARD_OFFSET + cardWidth
  return rightEdge <= viewportWidth - VIEWPORT_MARGIN ? 'right' : 'left'
}

export function clampCardY(pointerY: number, cardHeight: number, viewportHeight: number): number {
  const top = pointerY - cardHeight / 2
  const max = Math.max(VIEWPORT_MARGIN, viewportHeight - cardHeight - VIEWPORT_MARGIN)
  return clamp(top, VIEWPORT_MARGIN, max)
}
