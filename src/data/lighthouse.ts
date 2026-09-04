export type LighthouseCategory = 'performance' | 'accessibility' | 'bestPractices' | 'seo'

export interface LighthouseScore {
  id: LighthouseCategory
  value: number
}

export const LIGHTHOUSE_DATE = '2026-09-04'

export const lighthouse: LighthouseScore[] = [
  { id: 'performance', value: 99 },
  { id: 'accessibility', value: 100 },
  { id: 'bestPractices', value: 100 },
  { id: 'seo', value: 100 },
]
