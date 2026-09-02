<template>
  <div class="flex flex-col gap-[var(--space-8)] pt-[var(--space-12)]">
    <header class="flex flex-col gap-[var(--space-3)]">
      <!-- Счётчик и годы — мета: Archivo 12px, --faint. -->
      <span class="t-label">{{ counter }} · 2023—2025</span>
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
import { computed } from 'vue'
import { ListRow } from '@/components/ui/list-row'
import { projects } from '@/data/projects'

const counter = computed(() => {
  const n = projects.length
  const last = n % 10
  const teen = n % 100 >= 11 && n % 100 <= 14
  const word = teen || last === 0 || last >= 5 ? 'проектов' : last === 1 ? 'проект' : 'проекта'
  return `${n} ${word}`
})
</script>
