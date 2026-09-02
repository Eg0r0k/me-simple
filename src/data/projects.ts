/** Тон — то, чем проекты отличаются друг от друга (§5.6). Максимум 2–3 акцента на экран. */
export type ProjectTone = 'sky' | 'peri' | 'amber' | 'mint' | 'clay'

export interface Project {
  slug: string
  title: string
  caption: string
  year: number
  tone: ProjectTone
  /** Material Symbols Rounded, filled. */
  icon: string
}

export const projects: Project[] = [
  {
    slug: 'audiogram',
    title: 'Audiogram',
    caption: 'Плеер с разбором спектра и офлайн-очередью',
    year: 2025,
    tone: 'sky',
    icon: 'graphic_eq',
  },
  {
    slug: 'shader-lab',
    title: 'Shader Lab',
    caption: 'Песочница для WebGL-шейдеров с горячей пересборкой',
    year: 2025,
    tone: 'peri',
    icon: 'deployed_code',
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    caption: 'Этот сайт: Vue 3, Vite, собственная дизайн-система',
    year: 2024,
    tone: 'mint',
    icon: 'draw',
  },
  {
    slug: 'timetable',
    title: 'Timetable',
    caption: 'Расписание для небольших команд без единого бордера',
    year: 2024,
    tone: 'amber',
    icon: 'calendar_month',
  },
  {
    slug: 'codegraph',
    title: 'CodeGraph',
    caption: 'Граф символов проекта поверх tree-sitter',
    year: 2023,
    tone: 'clay',
    icon: 'account_tree',
  },
]
