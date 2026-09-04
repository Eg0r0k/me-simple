export type Tone = 'sky' | 'peri' | 'amber' | 'mint' | 'clay'

export const TONE_BG: Record<Tone, string> = {
  sky: 'bg-sky-soft',
  peri: 'bg-peri-soft',
  amber: 'bg-amber-soft',
  mint: 'bg-mint-soft',
  clay: 'bg-clay-soft',
}

export const TONE_FG: Record<Tone, string> = {
  sky: 'text-sky',
  peri: 'text-peri',
  amber: 'text-amber',
  mint: 'text-mint',
  clay: 'text-clay',
}

export const TONE_INK: Record<Tone, string> = {
  sky: 'text-sky-ink',
  peri: 'text-peri-ink',
  amber: 'text-amber-ink',
  mint: 'text-mint-ink',
  clay: 'text-clay-ink',
}
