export type ProjectTone = 'sky' | 'peri' | 'amber' | 'mint' | 'clay'

export interface Project {
  slug: string
  title: string
  captionKey: string
  year: number
  tone: ProjectTone
  icon: string
  url?: string
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
    slug: 'lyra-audio',
    title: 'lyra-audio',
    captionKey: 'projects.items.lyraAudio',
    year: 2025,
    tone: 'peri',
    icon: 'equalizer',
    url: 'https://npmjs.com/package/lyra-audio',
  },
  {
    slug: 'typemore',
    title: 'TypeMore',
    captionKey: 'projects.items.typemore',
    year: 2024,
    tone: 'amber',
    icon: 'keyboard',
    url: 'https://typemore.elackov.com/',
  },
  {
    slug: 'tuna',
    title: 'TunA',
    captionKey: 'projects.items.tuna',
    year: 2024,
    tone: 'mint',
    icon: 'tune',
  },
]
