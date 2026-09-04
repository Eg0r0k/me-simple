import { describe, it, expect } from 'vitest'
import ru from '@/app/i18n/locales/ru/awards.json'
import en from '@/app/i18n/locales/en/awards.json'
import { awards } from './awards'

describe('awards', () => {
  it('у каждого достижения есть тексты в обеих локалях', () => {
    for (const award of awards) {
      for (const locale of [ru, en]) {
        const item = (locale.items as Record<string, { title: string; subtitle: string }>)[award.id]
        expect(item?.title, award.id).toBeTruthy()
        expect(item?.subtitle, award.id).toBeTruthy()
      }
    }
  })

  it('идут от новых к старым', () => {
    const years = awards.map((award) => award.year)
    expect(years).toEqual([...years].sort((a, b) => b - a))
  })
})
