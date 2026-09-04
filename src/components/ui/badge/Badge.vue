<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import type { BadgeVariants } from '.'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { badgeVariants } from '.'

const props = withDefaults(
  defineProps<{
    size?: BadgeVariants['size']
    tone?: BadgeVariants['tone']
    icon?: Component
    dot?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { size: 'md', tone: 'secondary', dot: false },
)

const showDot = computed(() => props.dot && !props.icon)
const leading = computed(() => Boolean(props.icon) || showDot.value)
</script>

<template>
  <span
    data-slot="badge"
    :class="
      cn(badgeVariants({ size: props.size, tone: props.tone, leading: leading }), props.class)
    "
  >
    <component :is="props.icon" v-if="props.icon" aria-hidden="true" />
    <span v-else-if="showDot" class="size-1.5 shrink-0 rounded-full bg-current" />
    <slot />
  </span>
</template>
