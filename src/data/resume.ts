import type { Component } from 'vue'
import type { ProjectTone } from './projects'
import IconBolt from '~icons/material-symbols/bolt-rounded'
import IconDashboard from '~icons/material-symbols/dashboard-rounded'
import IconPalette from '~icons/material-symbols/palette-rounded'

export interface Job {
  id: string
  period: string
  tone: ProjectTone
  icon: Component
  url?: string
}

export const experience: Job[] = [
  { id: 'own', period: '', tone: 'mint', icon: IconBolt },
  {
    id: 'codeMasters',
    period: '2023—2025',
    tone: 'sky',
    icon: IconDashboard,
    url: 'https://botb2b.ru',
  },
  { id: 'novaCode', period: '2022—2023', tone: 'peri', icon: IconPalette },
]
