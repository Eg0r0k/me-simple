<script setup lang="ts">
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'

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
    :href="url"
    :target="url ? '_blank' : undefined"
    :rel="url ? 'noopener noreferrer' : undefined"
    :class="[
      'flex items-baseline gap-[16px] -mx-[12px] rounded-4 px-[12px] py-[var(--row)] text-fg no-underline',
      url &&
        'press-scale [transition:background-color_var(--dur-surface)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:bg-sunk',
    ]"
    :data-cuelume-hover="url ? 'whisper' : undefined"
  >
    <span class="t-hand w-[56px] shrink-0 text-[20px] text-primary">{{ year }}</span>
    <span class="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-[8px]">
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
