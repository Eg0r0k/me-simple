<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

type Shape = 'line' | 'title' | 'tile' | 'avatar' | 'plate'

const props = withDefaults(
  defineProps<{
    shape?: Shape
    delay?: number
    class?: HTMLAttributes['class']
  }>(),
  { shape: 'line', delay: 0 },
)

const SHAPES: Record<Shape, string> = {
  line: 'h-[11px] w-full rounded-[5px]',
  title: 'h-[14px] w-3/5 rounded-xs',
  tile: 'size-[36px] rounded-[11px]',
  avatar: 'size-[36px] rounded-full',
  plate: 'h-[132px] w-full rounded-3',
}

const shapeClass = computed(() => SHAPES[props.shape])
</script>

<template>
  <div
    data-slot="skeleton"
    aria-hidden="true"
    :class="cn('relative overflow-hidden bg-sunk', shapeClass, props.class)"
  >
    <div
      class="absolute inset-0 bg-[linear-gradient(90deg,transparent,var(--surface),transparent)] [animation:ds-sweep_var(--dur-loading)_linear_infinite] motion-reduce:animate-none"
      :style="{ animationDelay: `${props.delay}s` }"
    />
  </div>
</template>
