<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TONE_BG, TONE_FG, type Tone } from '@/lib/tone'

const props = withDefaults(
  defineProps<{
    icon: Component
    tone?: Tone
    class?: HTMLAttributes['class']
  }>(),
  { tone: 'sky' },
)
</script>

<template>
  <span
    :class="
      cn(
        'flex size-9 shrink-0 items-center justify-center rounded-3',
        TONE_BG[props.tone],
        TONE_FG[props.tone],
        props.class,
      )
    "
    aria-hidden="true"
  >
    <component :is="icon" class="size-5 shrink-0" />
  </span>
</template>
