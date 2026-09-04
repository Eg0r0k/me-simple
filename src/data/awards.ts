export interface Award {
  id: string
  year: number
  url?: string
}

export const awards: Award[] = [
  { id: 'procifru', year: 2025 },
  { id: 'yandexCup', year: 2024 },
  { id: 'hackathons', year: 2024 },
]
