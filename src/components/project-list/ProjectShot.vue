<script setup lang="ts">
import { computed } from 'vue'
import type { PreviewLocale, Project, ProjectTone } from '@/data/projects'
import { resolvePreviewSrc } from './preview'

const props = defineProps<{
  project: Project
  locale: PreviewLocale
}>()

const src = computed(() => resolvePreviewSrc(props.project.preview, props.locale))

const TONE_BG: Record<ProjectTone, string> = {
  sky: 'bg-sky-soft',
  peri: 'bg-peri-soft',
  amber: 'bg-amber-soft',
  mint: 'bg-mint-soft',
  clay: 'bg-clay-soft',
}

const TONE_INK: Record<ProjectTone, string> = {
  sky: 'text-sky-ink',
  peri: 'text-peri-ink',
  amber: 'text-amber-ink',
  mint: 'text-mint-ink',
  clay: 'text-clay-ink',
}
</script>

<template>
  <div class="relative aspect-video overflow-hidden bg-sunk">
    <!-- alt пустой: название проекта стоит рядом текстом. -->
    <img
      v-if="src"
      :src="src"
      alt=""
      decoding="async"
      draggable="false"
      fetchpriority="low"
      class="absolute inset-0 size-full object-cover object-left-top select-none"
    />
    <div
      v-else-if="project.preview.kind === 'command'"
      :class="[
        'absolute inset-0 flex items-center justify-center t-code text-[14px]',
        TONE_BG[project.tone],
        TONE_INK[project.tone],
      ]"
    >
      {{ project.preview.command }}
    </div>
  </div>
</template>
