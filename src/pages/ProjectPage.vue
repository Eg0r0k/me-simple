<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ListRow } from '@/components/ui/list-row'
import { projects } from '@/data/projects'

const { t } = useI18n()

const counter = computed(() => t('projects.count', projects.length))
</script>

<template>
  <div class="flex flex-col gap-[var(--space-8)] pt-[var(--space-12)]">
    <header class="flex flex-col gap-[var(--space-3)]">
      <span class="t-label">{{ counter }} · {{ t('projects.range') }}</span>
      <h1 class="t-title">{{ t('projects.title') }}</h1>
    </header>

    <div class="flex flex-col">
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
        :trailing-icon="project.url ? 'arrow_outward' : ''"
      />
    </div>
  </div>
</template>
