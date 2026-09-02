import type { ProjectTone } from './projects'

export interface Job {
  id: string
  period: string
  tone: ProjectTone
  icon: string
}

export const experience: Job[] = [
  { id: 'own', period: '2025 —', tone: 'mint', icon: 'bolt' },
  { id: 'codeMasters', period: '2023—2025', tone: 'sky', icon: 'dashboard' },
  { id: 'novaCode', period: '2022—2023', tone: 'peri', icon: 'palette' },
]
