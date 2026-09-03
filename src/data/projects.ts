import type { Component } from 'vue'
import IconGraphicEq from '~icons/material-symbols/graphic-eq-rounded'
import IconEqualizer from '~icons/material-symbols/equalizer-rounded'
import IconKeyboard from '~icons/material-symbols/keyboard-rounded'
import IconTune from '~icons/material-symbols/tune-rounded'

export type ProjectTone = 'sky' | 'peri' | 'amber' | 'mint' | 'clay'

export interface Project {
  slug: string
  title: string
  captionKey: string
  year: number
  tone: ProjectTone
  icon: Component
  url?: string
}

export const projects: Project[] = [
  {
    slug: 'audiogram',
    title: 'Audiogram',
    captionKey: 'projects.items.audiogram',
    year: 2025,
    tone: 'sky',
    icon: IconGraphicEq,
    url: 'https://github.com/Eg0r0k/Audiogram',
  },
  {
    slug: 'lyra-audio',
    title: 'lyra-audio',
    captionKey: 'projects.items.lyraAudio',
    year: 2025,
    tone: 'peri',
    icon: IconEqualizer,
    url: 'https://npmjs.com/package/lyra-audio',
  },
  {
    slug: 'typemore',
    title: 'TypeMore',
    captionKey: 'projects.items.typemore',
    year: 2024,
    tone: 'amber',
    icon: IconKeyboard,
    url: 'https://typemore.elackov.com/',
  },
  {
    slug: 'tuna',
    title: 'TunA',
    captionKey: 'projects.items.tuna',
    year: 2024,
    tone: 'mint',
    icon: IconTune,
    url: 'https://eg0r0k.github.io/TunA/',
  },
]
