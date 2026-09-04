<script setup lang="ts">
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import { externalLinkAttrs } from '@/lib/links'

defineProps<{
  year: number
  title: string
  subtitle: string
  url?: string
}>()
</script>

<template>
  <component
    :is="url ? 'a' : 'article'"
    v-bind="externalLinkAttrs(url)"
    :class="[
      'flex items-baseline gap-4 -mx-3 rounded-4 px-3 py-(--row) text-fg no-underline',
      url &&
        'press-scale [transition:background-color_var(--dur-surface)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:bg-sunk',
    ]"
  >
    <span class="t-hand w-14 shrink-0 text-[20px] text-primary">{{ year }}</span>
    <span class="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
      <span class="text-[15.5px] font-semibold tracking-[-0.012em]">{{ title }}</span>
      <span class="t-small">{{ subtitle }}</span>
    </span>
    <IconArrowOutward
      v-if="url"
      class="size-5 shrink-0 self-center text-faint"
      aria-hidden="true"
    />
  </component>
</template>
