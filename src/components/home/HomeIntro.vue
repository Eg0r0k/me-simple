<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { I18nT, useI18n } from 'vue-i18n'
import IconCheck from '~icons/material-symbols/verified-rounded'
import type { StackItem } from '@/data/stack'
import { useMoscowTime } from '@/composables/useMoscowTime'
import { nextFrame } from '@/lib/frame'
import { rise } from '@/lib/motion'
import { publicUrl } from '@/lib/site'
import TechChip from './TechChip.vue'
import HoverNote from './HoverNote.vue'
import CountUp from './CountUp.vue'

defineProps<{
  stack: StackItem[]
  email: string
  mailto: string
}>()

const { t } = useI18n()
const { time } = useMoscowTime()

const DELAY_FACE = 0
const DELAY_LEAD = 0.08
const DELAY_TECH = 0.14
const DELAY_MORE = 0.2

const leadYears = computed(() => {
  const n = Number(t('home.years'))
  return Number.isFinite(n) ? n : 4
})

const techLineOn = ref(false)
onMounted(() => {
  nextFrame(() => {
    techLineOn.value = true
  })
})
</script>

<template>
  <section class="flex flex-col gap-(--space-6)">
    <div v-motion v-bind="rise(DELAY_FACE)" class="flex items-center gap-(--space-3)">
      <span
        class="flex items-center justify-center size-15 shrink-0 overflow-hidden rounded-full bg-surface"
      >
        <img
          :src="publicUrl('face.svg')"
          alt=""
          width="118"
          height="150"
          class="h-12 w-auto select-none"
          draggable="false"
        />
      </span>

      <span class="flex min-w-0 flex-col leading-[1.45]">
        <h1 class="m-0 text-[16px] font-semibold tracking-[-0.012em] text-fg">
          {{ t('home.name') }}
          <IconCheck class="inline text-primary size-4 ml-1" />
        </h1>
        <p
          class="m-0 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[16px] text-muted-foreground"
        >
          {{ t('home.role') }}
          <span class="inline-flex items-center gap-0.5">
            <TechChip
              v-for="item in stack"
              :key="item.id"
              :label="item.label"
              :url="item.url"
              :icon="item.icon"
            />
          </span>
        </p>
      </span>
    </div>

    <div class="flex flex-col gap-(--space-3)">
      <I18nT
        v-motion
        v-bind="rise(DELAY_LEAD)"
        keypath="home.lead"
        tag="p"
        scope="global"
        class="t-body text-muted-foreground"
      >
        <template #years><CountUp :to="leadYears" /></template>
        <template #stack>
          <span class="tech-line" :class="{ 'is-on': techLineOn }">{{ t('home.stack') }}</span>
        </template>
      </I18nT>
      <I18nT
        v-motion
        v-bind="rise(DELAY_TECH)"
        keypath="home.tech"
        tag="p"
        scope="global"
        class="t-body text-muted-foreground"
      >
        <template #city>
          <HoverNote :title="time" :text="t('home.notes.city')">{{ t('home.city') }}</HoverNote>
        </template>
        <template #remote>
          <HoverNote :title="t('home.notes.remote.title')" :text="t('home.notes.remote.text')">{{
            t('home.remote')
          }}</HoverNote>
        </template>
        <template #open>
          <HoverNote
            :href="mailto"
            :title="t('home.notes.open.title')"
            :text="`${email}, ${t('home.notes.open.text')}`"
            dot
            >{{ t('home.open') }}</HoverNote
          >
        </template>
      </I18nT>
      <p v-motion v-bind="rise(DELAY_MORE)" class="t-body text-muted-foreground">
        {{ t('home.more') }}
      </p>
    </div>
  </section>
</template>
