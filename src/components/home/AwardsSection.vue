<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Award } from '@/data/awards'
import { reveal } from '@/lib/motion'
import AwardRow from './AwardRow.vue'
import SectionTitle from './SectionTitle.vue'

defineProps<{
  awards: Award[]
}>()

const { t } = useI18n()
</script>

<template>
  <section v-motion v-bind="reveal()" class="flex flex-col gap-(--space-4)">
    <SectionTitle>{{ t('awards.title') }}</SectionTitle>

    <ul class="m-0 flex list-none flex-col p-0">
      <li v-for="award in awards" :key="award.id">
        <AwardRow
          :year="award.year"
          :title="t(`awards.items.${award.id}.title`)"
          :subtitle="t(`awards.items.${award.id}.subtitle`)"
          :url="award.url"
        />
      </li>
    </ul>
  </section>
</template>
