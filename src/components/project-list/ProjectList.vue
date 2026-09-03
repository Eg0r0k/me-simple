<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMediaQuery } from '@vueuse/core'
import { useMotionValue } from 'motion-v'
import { ListRow } from '@/components/ui/list-row'
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import type { Project } from '@/data/projects'
import { toPreviewLocale } from './preview'
import ProjectPreview from './ProjectPreview.vue'

defineProps<{
  projects: Project[]
}>()

const { t, locale } = useI18n()

// Карточка только там, где есть ховер и точный указатель. На таче список как был.
const canHover = useMediaQuery('(hover: hover) and (pointer: fine)')

const hoveredSlug = ref<string | null>(null)
const pointerX = useMotionValue(0)
const pointerY = useMotionValue(0)
const previewLocale = computed(() => toPreviewLocale(locale.value))

const onPointerMove = (event: PointerEvent) => {
  pointerX.set(event.clientX)
  pointerY.set(event.clientY)
}
</script>

<template>
  <div class="flex flex-col" @pointermove="onPointerMove" @pointerleave="hoveredSlug = null">
    <ListRow
      v-for="project in projects"
      :key="project.slug"
      :as="project.url ? 'a' : 'article'"
      :href="project.url"
      :target="project.url ? '_blank' : undefined"
      :rel="project.url ? 'noopener noreferrer' : undefined"
      :tone="project.tone"
      :icon="project.icon"
      :title="project.title"
      :caption="t(project.captionKey)"
      :year="project.year"
      :trailing-icon="project.url ? IconArrowOutward : null"
      @pointerenter="hoveredSlug = project.slug"
    />

    <ProjectPreview
      v-if="canHover"
      :projects="projects"
      :active-slug="hoveredSlug"
      :pointer-x="pointerX"
      :pointer-y="pointerY"
      :locale="previewLocale"
    />
  </div>
</template>
