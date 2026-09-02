export type ProjectTone = 'sky' | 'peri' | 'amber' | 'mint' | 'clay'

export interface Project {
  slug: string
  title: string
  captionKey: string
  year: number
  tone: ProjectTone
  icon: string
}

export const projects: Project[] = [
  {
    slug: 'audiogram',
    title: 'Audiogram',
    captionKey: 'projects.items.audiogram',
    year: 2025,
    tone: 'sky',
    icon: 'graphic_eq',
  },
  {
    slug: 'shader-lab',
    title: 'Shader Lab',
    captionKey: 'projects.items.shaderLab',
    year: 2025,
    tone: 'peri',
    icon: 'deployed_code',
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    captionKey: 'projects.items.portfolio',
    year: 2024,
    tone: 'mint',
    icon: 'draw',
  },
  {
    slug: 'timetable',
    title: 'Timetable',
    captionKey: 'projects.items.timetable',
    year: 2024,
    tone: 'amber',
    icon: 'calendar_month',
  },
  {
    slug: 'codegraph',
    title: 'CodeGraph',
    captionKey: 'projects.items.codegraph',
    year: 2023,
    tone: 'clay',
    icon: 'account_tree',
  },
]
