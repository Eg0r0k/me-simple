<template>
  <div class="flex flex-col gap-[var(--space-8)] pt-[var(--space-12)]">
    <header class="flex flex-col gap-[var(--space-3)]">
      <!-- Счётчик и годы — мета: Archivo 12px, --faint. -->
      <span class="t-label">
        {{ t('projects.count', projects.length) }} · {{ t('projects.range') }}
      </span>
      <h1 class="t-title">{{ t('projects.title') }}</h1>
    </header>

    <!-- Список длиннее шести элементов — строки, не карточки. Разделителей нет. -->
    <div class="flex flex-col">
      <ListRow
        v-for="project in projects"
        :key="project.slug"
        as="article"
        :tone="project.tone"
        :icon="project.icon"
        :title="project.title"
        :caption="t(project.captionKey)"
        :year="project.year"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ListRow } from '@/components/ui/list-row'
import { projects } from '@/data/projects'

const { t } = useI18n()
</script>
