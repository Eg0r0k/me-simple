<script setup lang="ts">
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import { externalLinkAttrs } from '@/lib/links'

defineProps<{
  role: string
  company: string
  period: string
  bullets: string[]
  url?: string
}>()
</script>

<template>
  <article data-slot="cv-job" class="flex flex-col gap-2 break-inside-avoid py-(--row)">
    <header class="flex items-baseline gap-4">
      <span class="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h3 class="m-0 text-[15.5px] font-semibold tracking-[-0.012em] text-fg">{{ role }}</h3>
        <component
          :is="url ? 'a' : 'span'"
          v-bind="externalLinkAttrs(url)"
          class="t-small inline-flex items-center gap-0.5 no-underline"
        >
          {{ company }}
          <IconArrowOutward v-if="url" class="size-4 text-faint" aria-hidden="true" />
        </component>
      </span>
      <span class="t-label shrink-0 whitespace-nowrap">{{ period }}</span>
    </header>
    <ul class="m-0 flex list-disc flex-col gap-1 ps-4 marker:text-faint">
      <li v-for="(bullet, index) in bullets" :key="index" class="t-small ps-1">
        {{ bullet }}
      </li>
    </ul>
  </article>
</template>
