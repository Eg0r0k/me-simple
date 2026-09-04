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
        't-code pointer-events-none inline-flex h-5 w-fit min-w-5 select-none items-center justify-center gap-1 rounded-xs bg-sunk px-1 text-[11px] text-muted-foreground',
        '[&_svg:not([class*=\'size-\'])]:size-3',
        'in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10',
        props.class,
      )
    "
  >
    <slot />
  </kbd>
</template>
