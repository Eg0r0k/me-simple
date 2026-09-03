import { describe, it, expect } from 'vitest'
import type { ProjectPreview } from '@/data/projects'
import { clampCardY, clampTilt, placeCard, resolvePreviewSrc, toPreviewLocale } from './preview'

describe('toPreviewLocale', () => {
  it('русский и его региональные варианты дают ru', () => {
    expect(toPreviewLocale('ru')).toBe('ru')
    expect(toPreviewLocale('ru-RU')).toBe('ru')
  })

  it('всё остальное даёт en', () => {
    expect(toPreviewLocale('en')).toBe('en')
    expect(toPreviewLocale('de')).toBe('en')
  })
})

describe('resolvePreviewSrc', () => {
  const both: ProjectPreview = { kind: 'image', src: { ru: '/ru.webp', en: '/en.webp' } }
  const onlyEn: ProjectPreview = { kind: 'image', src: { en: '/en.webp' } }
  const onlyRu: ProjectPreview = { kind: 'image', src: { ru: '/ru.webp' } }
  const command: ProjectPreview = { kind: 'command', command: 'npm i x' }

  it('берёт кадр текущего языка', () => {
    expect(resolvePreviewSrc(both, 'ru')).toBe('/ru.webp')
    expect(resolvePreviewSrc(both, 'en')).toBe('/en.webp')
  })

  it('без кадра на текущем языке падает на en', () => {
    expect(resolvePreviewSrc(onlyEn, 'ru')).toBe('/en.webp')
  })

  it('без en берёт первый доступный', () => {
    expect(resolvePreviewSrc(onlyRu, 'en')).toBe('/ru.webp')
  })

  it('у плашки с командой кадра нет', () => {
    expect(resolvePreviewSrc(command, 'ru')).toBeNull()
  })
})

describe('clampTilt', () => {
  it('в покое наклона нет', () => {
    expect(clampTilt(0)).toBe(0)
  })

  it('внутри диапазона угол пропорционален скорости', () => {
    expect(clampTilt(500)).toBeCloseTo(2)
    expect(clampTilt(-500)).toBeCloseTo(-2)
  })

  it('угол ограничен шестью градусами в обе стороны', () => {
    expect(clampTilt(5000)).toBe(6)
    expect(clampTilt(-5000)).toBe(-6)
  })
})

describe('placeCard', () => {
  // Карточка 280px, отступ от курсора 20px, поле у края окна 16px.
  it('ставит карточку справа, когда она помещается', () => {
    expect(placeCard(100, 280, 1000)).toBe('right')
  })

  it('перекидывает влево, когда правый край уходит за окно', () => {
    // 700 + 20 + 280 = 1000 > 1000 - 16
    expect(placeCard(700, 280, 1000)).toBe('left')
  })

  it('граница: ровно помещается — остаётся справа', () => {
    // 684 + 20 + 280 = 984 = 1000 - 16
    expect(placeCard(684, 280, 1000)).toBe('right')
  })
})

describe('clampCardY', () => {
  // Карточка высотой 157.5px (280 * 9/16), поле у края окна 16px.
  it('центрирует по курсору, когда места достаточно', () => {
    expect(clampCardY(400, 157.5, 900)).toBeCloseTo(321.25)
  })

  it('прижимает к 16 у верхнего края', () => {
    expect(clampCardY(30, 157.5, 900)).toBe(16)
  })

  it('прижимает к нижнему краю', () => {
    // 900 - 157.5 - 16 = 726.5
    expect(clampCardY(880, 157.5, 900)).toBeCloseTo(726.5)
  })

  it('окно ниже карточки — всё равно возвращает 16', () => {
    expect(clampCardY(400, 157.5, 100)).toBe(16)
  })
})
