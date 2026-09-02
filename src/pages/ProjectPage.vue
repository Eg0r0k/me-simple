<template>
  <div class="flex flex-col gap-[var(--space-8)] pt-[var(--space-12)]">
    <header class="flex flex-col gap-[var(--space-3)]">
      <span class="t-label">{{ projects.length }} проекта · 2023—2025</span>
      <h1 class="t-title">Работы</h1>
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
        :caption="project.caption"
        :year="project.year"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ListRow } from '@/components/ui/list-row'
import { projects } from '@/data/projects'
</script>
