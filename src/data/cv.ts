export type CvSkillGroupId = 'frontend' | 'data' | 'ui' | 'tools'

export interface CvSkillGroup {
  id: CvSkillGroupId
  items: string[]
}

export const cvSkills: CvSkillGroup[] = [
  { id: 'frontend', items: ['Vue 3', 'Nuxt', 'TypeScript', 'JavaScript'] },
  { id: 'data', items: ['Pinia', 'TanStack Query', 'VueUse', 'REST', 'WebSocket'] },
  { id: 'ui', items: ['Tailwind CSS', 'SCSS', 'shadcn/ui', 'Radix', 'Headless UI', 'Figma'] },
  { id: 'tools', items: ['Vite', 'Tauri', 'Docker', 'Git', 'GitHub Actions', 'GitLab CI'] },
]
