<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useElementVisibility } from '@vueuse/core'
import type { LighthouseScore } from '@/data/lighthouse'
import { externalLinkAttrs } from '@/lib/links'
import { reveal } from '@/lib/motion'
import { SITE_URL } from '@/lib/site'
import ScoreRing from './ScoreRing.vue'
import SectionTitle from './SectionTitle.vue'

const props = defineProps<{
  scores: LighthouseScore[]
  date: string
}>()

const STAGGER_MS = 120

const { t, locale } = useI18n()

const el = useTemplateRef<HTMLElement>('el')
const canObserve = typeof IntersectionObserver !== 'undefined'
const visible = useElementVisibility(el)
const active = ref(!canObserve)

const stop = watch(visible, (isVisible) => {
  if (isVisible) {
    active.value = true
    stop()
  }
})

const month = computed(() =>
  new Intl.DateTimeFormat(locale.value, { month: 'long', year: 'numeric' }).format(
    new Date(props.date),
  ),
)

const reportUrl = computed(
  () => `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(SITE_URL)}`,
)
</script>

<template>
  <section ref="el" v-motion v-bind="reveal()" class="flex flex-col gap-(--space-4)">
    <div class="flex items-baseline justify-between gap-3">
      <SectionTitle>{{ t('home.lighthouse.title') }}</SectionTitle>
      <a
        v-bind="externalLinkAttrs(reportUrl)"
        class="t-label no-underline [transition:color_var(--dur-hover)_ease] hover:text-fg"
      >
        {{ t('home.lighthouse.caption', { date: month }) }}
      </a>
    </div>

    <div class="grid grid-cols-4 justify-items-center gap-2 sm:gap-4">
      <ScoreRing
        v-for="(score, index) in scores"
        :key="score.id"
        :value="score.value"
        :label="t(`home.lighthouse.${score.id}`)"
        :active="active"
        :delay="index * STAGGER_MS"
      />
    </div>
  </section>
</template>
