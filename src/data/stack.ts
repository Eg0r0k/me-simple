import type { Component } from 'vue'
import IconVue from '~icons/logos/vue'
import IconNuxt from '~icons/logos/nuxt-icon'
import IconTypeScript from '~icons/logos/typescript-icon'

export interface StackItem {
  id: string
  label: string
  url: string
  icon: Component
}

export const stack: StackItem[] = [
  { id: 'vue', label: 'Vue', url: 'https://vuejs.org/', icon: IconVue },
  { id: 'nuxt', label: 'Nuxt', url: 'https://nuxt.com/', icon: IconNuxt },
  {
    id: 'typescript',
    label: 'TypeScript',
    url: 'https://www.typescriptlang.org/',
    icon: IconTypeScript,
  },
]
