<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ListRow } from '@/components/ui/list-row'
import type { Job } from '@/data/resume'
import { reveal } from '@/lib/motion'
import SectionTitle from './SectionTitle.vue'

defineProps<{
  jobs: Job[]
}>()

const { t } = useI18n()
</script>

<template>
  <section v-motion v-bind="reveal()" class="flex flex-col gap-(--space-4)">
    <SectionTitle>{{ t('experience.title') }}</SectionTitle>

    <div class="flex flex-col">
      <ListRow
        v-for="job in jobs"
        :key="job.id"
        as="article"
        :tone="job.tone"
        :icon="job.icon"
        :title="t(`experience.items.${job.id}.role`)"
        :caption="t(`experience.items.${job.id}.company`)"
        :year="job.period"
        :trailing-icon="null"
      >
        <p class="t-small">{{ t(`experience.items.${job.id}.summary`) }}</p>
      </ListRow>
    </div>
  </section>
</template>
