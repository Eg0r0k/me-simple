<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'

const el = useTemplateRef<HTMLElement>('el')
const canObserve = typeof IntersectionObserver !== 'undefined'
const visible = useElementVisibility(el)
const drawn = ref(!canObserve)

const stop = watch(visible, (isVisible) => {
  if (isVisible) {
    drawn.value = true
    stop()
  }
})
</script>

<template>
  <span ref="el" class="pen-stroke" :class="{ 'pen-stroke-drawn': drawn }">
    <slot />
    <svg class="pen-stroke-ink" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M 6 22 C 10 6, 58 2, 90 8 C 104 14, 98 34, 60 37 C 26 39, 0 33, 4 20 C 7 12, 30 9, 52 9"
        pathLength="1"
      />
    </svg>
  </span>
</template>
