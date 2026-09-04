<script setup lang="ts">
import { computed, onScopeDispose, ref, watch } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    value: number
    label: string
    active: boolean
    delay?: number
    duration?: number
  }>(),
  { delay: 0, duration: 1100 },
)

const reduced = usePreferredReducedMotion()
const noMotion = computed(() => reduced.value === 'reduce')

const shown = ref(noMotion.value ? props.value : 0)
const progress = ref(noMotion.value ? props.value : 0)

let started = false
let frame = 0
let timer: ReturnType<typeof setTimeout> | undefined

function run() {
  progress.value = props.value
  frame = requestAnimationFrame((start) => {
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / props.duration)
      shown.value = Math.round(props.value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    tick(start)
  })
}

watch(
  () => props.active,
  (active) => {
    if (!active || started) return
    started = true
    if (noMotion.value || typeof requestAnimationFrame === 'undefined') {
      shown.value = props.value
      progress.value = props.value
      return
    }
    timer = setTimeout(run, props.delay)
  },
  { immediate: true },
)

onScopeDispose(() => {
  clearTimeout(timer)
  if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(frame)
}, true)

const tone = computed(() => {
  if (props.value >= 90) return { stroke: 'stroke-mint', ink: 'text-mint-ink' }
  if (props.value >= 50) return { stroke: 'stroke-amber', ink: 'text-amber-ink' }
  return { stroke: 'stroke-danger', ink: 'text-danger-ink' }
})

const ringStyle = computed(() => ({
  transition: noMotion.value
    ? 'none'
    : `stroke-dashoffset ${props.duration}ms var(--ease-standard)`,
}))
</script>

<template>
  <span role="img" :aria-label="`${label}: ${value}`" class="flex flex-col items-center gap-2">
    <span class="relative size-16" aria-hidden="true">
      <svg viewBox="0 0 64 64" class="size-full -rotate-90">
        <circle cx="32" cy="32" r="28" fill="none" stroke-width="3" class="stroke-fill" />
        <circle
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke-width="3"
          stroke-linecap="round"
          pathLength="100"
          stroke-dasharray="100"
          :stroke-dashoffset="100 - progress"
          :class="tone.stroke"
          :style="ringStyle"
        />
      </svg>
      <span
        :class="[
          'absolute inset-0 flex items-center justify-center t-code text-[15px] font-medium',
          tone.ink,
        ]"
        >{{ shown }}</span
      >
    </span>
    <span class="t-label text-center leading-tight" aria-hidden="true">{{ label }}</span>
  </span>
</template>
