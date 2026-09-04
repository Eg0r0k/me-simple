<script setup lang="ts">
import { onMounted, onScopeDispose, ref } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const props = withDefaults(defineProps<{ to: number; duration?: number; delay?: number }>(), {
  duration: 550,
  delay: 300,
})

const reduced = usePreferredReducedMotion()
// Значение reduced уже известно синхронно на этом шаге — задаём стартовое
// число сразу, чтобы reduced-motion не ждал первого реактивного апдейта.
const shown = ref(reduced.value === 'reduce' ? props.to : 0)
let frame = 0
let timer: ReturnType<typeof setTimeout> | undefined

function run() {
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / props.duration)
    shown.value = Math.round(props.to * (1 - Math.pow(1 - p, 3)))
    if (p < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  if (reduced.value === 'reduce' || typeof requestAnimationFrame === 'undefined') {
    shown.value = props.to
    return
  }
  timer = setTimeout(run, props.delay)
})

onScopeDispose(() => {
  clearTimeout(timer)
  if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frame)
}, true)
</script>

<template>
  <span class="inline-block">
    <span
      class="t-hand inline-block min-w-[1.1ch] align-[-0.08em] text-[1.45em] tabular-nums text-primary"
      aria-hidden="true"
      >{{ shown }}</span
    >
    <span class="sr-only">{{ to }}</span>
  </span>
</template>
