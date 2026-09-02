<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number

const props = withDefaults(
  defineProps<{
    name: string
    size?: IconSize
    color?: string
    class?: HTMLAttributes['class']
  }>(),
  { size: 'md', color: 'currentColor' },
)

const SIZES: Record<Exclude<IconSize, number>, number> = {
  xs: 15,
  sm: 18,
  md: 20,
  lg: 24,
  xl: 32,
}

const pixels = computed(() => (typeof props.size === 'number' ? props.size : SIZES[props.size]))
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn('ms align-middle', props.class)"
    :style="{ fontSize: `${pixels}px`, color: props.color }"
    >{{ name }}</span
  >
</template>
