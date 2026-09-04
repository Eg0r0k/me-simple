<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { TONE_BG, TONE_FG, type Tone } from '@/lib/tone'
import IconImage from '~icons/material-symbols/image-rounded'

type Ratio = 'wide' | 'screen' | 'crop' | 'square'
type Radius = 'card' | 'alone' | 'bleed' | 'full'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    ratio?: Ratio
    radius?: Radius
    tone?: Tone
    icon?: Component
    caption?: string
    note?: string
    placeholder?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { ratio: 'screen', radius: 'alone', placeholder: false },
)

const icon = computed(() => props.icon ?? IconImage)

const RATIOS: Record<Ratio, string> = {
  wide: 'aspect-21/9',
  screen: 'aspect-video',
  crop: 'aspect-4/3',
  square: 'aspect-square',
}

const RADII: Record<Radius, string> = {
  card: 'rounded-4',
  alone: 'rounded-panel',
  bleed: 'rounded-none',
  full: 'rounded-full',
}

const emptyBg = computed(() => (props.tone ? TONE_BG[props.tone] : 'bg-sunk'))
const emptyFg = computed(() => (props.tone ? TONE_FG[props.tone] : 'text-faint'))
</script>

<template>
  <figure :class="cn('m-0 flex flex-col gap-2.5', props.class)">
    <div
      :class="
        cn(
          'relative flex items-center justify-center overflow-hidden',
          RATIOS[props.ratio],
          RADII[props.radius],
          props.src ? 'bg-sunk' : emptyBg,
          props.placeholder &&
            'bg-[repeating-linear-gradient(45deg,var(--sunk)_0_10px,var(--surface)_10px_20px)]',
        )
      "
    >
      <img
        v-if="props.src"
        :src="props.src"
        :alt="props.alt ?? ''"
        class="size-full object-cover"
      />
      <span v-else-if="props.placeholder" class="t-label">drop a shot here</span>
      <component :is="icon" v-else :class="cn('size-6.5 shrink-0', emptyFg)" aria-hidden="true" />

      <span
        v-if="props.note"
        class="t-hand pointer-events-none absolute bottom-2 right-3 text-[16px] text-clay"
        >{{ props.note }}</span
      >
    </div>

    <figcaption v-if="props.caption" class="t-label">{{ props.caption }}</figcaption>
  </figure>
</template>
