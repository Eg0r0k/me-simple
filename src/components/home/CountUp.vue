<script setup lang="ts">
import { onMounted, onScopeDispose, ref } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const props = withDefaults(defineProps<{ to: number; duration?: number; delay?: number }>(), {
  duration: 550,
  delay: 300,
})

const reduced = usePreferredReducedMotion()
const shown = ref(reduced.value === 'reduce' ? props.to : 0)
let frame = 0
let timer: ReturnType<typeof setTimeout> | undefined

function run() {
  frame = requestAnimationFrame((first) => {
    const start = first
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / props.duration)
      shown.value = Math.round(props.to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    tick(first)
  })
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
  <span>
    <span class="t-hand w-[1.4ch] text-center align-[-0.08em] text-[1.45em]" aria-hidden="true">{{
      shown
    }}</span>
    <span class="sr-only">{{ to }}</span>
  </span>
</template>
