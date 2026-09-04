<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import IconArrowForward from '~icons/material-symbols/arrow-forward-rounded'
import { ProjectList } from '@/components/project-list'
import type { Project } from '@/data/projects'
import { routeLocation } from '@/router/route-locations'
import { reveal } from '@/lib/motion'

defineProps<{
  projects: Project[]
}>()

const { t } = useI18n()
</script>

<template>
  <section v-motion v-bind="reveal()" class="flex flex-col gap-(--space-4)">
    <RouterLink
      :to="routeLocation.projects()"
      class="press-scale group -mx-3 flex min-h-11 items-center justify-between rounded-3 px-3 no-underline"
    >
      <h2
        class="m-0 flex items-center gap-1 text-[13.5px] font-semibold text-muted-foreground [transition:color_var(--dur-hover)_ease] group-hover:text-fg"
      >
        {{ t('projects.title') }}
        <IconArrowForward
          class="size-4 text-faint [transition:color_var(--dur-hover)_ease] group-hover:text-fg"
          aria-hidden="true"
        />
      </h2>
      <span class="t-label">{{ t('projects.count', projects.length) }}</span>
    </RouterLink>

    <ProjectList :projects="projects" />
  </section>
</template>
