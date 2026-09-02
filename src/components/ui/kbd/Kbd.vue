<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <kbd
    :class="
      cn(
        'pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-xs bg-sunk px-1 font-mono text-[11px] tracking-[0.04em] text-muted-foreground',
        '[&_svg:not([class*=\'size-\'])]:size-3',
        '[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10',
        props.class,
      )
    "
  >
    <slot />
  </kbd>
</template>
