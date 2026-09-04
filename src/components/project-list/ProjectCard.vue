<script setup lang="ts">
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import { useI18n } from 'vue-i18n'
import type { PreviewLocale, Project } from '@/data/projects'
import { externalLinkAttrs } from '@/lib/links'
import { rise } from '@/lib/motion'
import ProjectShot from './ProjectShot.vue'

defineProps<{
  project: Project
  locale: PreviewLocale
  delay: number
}>()

const { t } = useI18n()
</script>

<template>
  <component
    v-motion
    v-bind="{ ...rise(delay), ...externalLinkAttrs(project.url) }"
    :is="project.url ? 'a' : 'article'"
    class="group press-scale flex flex-col gap-(--space-3) rounded-card p-2 no-underline text-fg [transition:background-color_var(--dur-surface)_ease,transform_var(--dur-press)_var(--ease-standard)] bg-surface"
  >
    <div class="overflow-hidden rounded-3">
      <ProjectShot
        :project="project"
        :locale="locale"
        class="[transition:scale_var(--dur-reveal)_var(--ease-standard)] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>

    <div class="flex flex-col gap-1 px-1">
      <div class="flex items-center gap-2">
        <span class="truncate text-[15.5px] font-semibold tracking-[-0.012em]">{{
          project.title
        }}</span>
        <span class="ms-auto t-label">{{ project.year }}</span>
        <IconArrowOutward
          v-if="project.url"
          class="size-5 shrink-0 text-faint [transition:translate_var(--dur-hover)_var(--ease-standard)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
          aria-hidden="true"
        />
      </div>
      <p class="m-0 text-sm t-label">{{ t(project.captionKey) }}</p>
    </div>
  </component>
</template>
