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
        d="M 10 25 C 6 10, 38 2, 66 3 C 90 4, 104 11, 99 22 C 94 33, 68 40, 42 38 C 20 37, 3 31, 6 22 C 9 15, 22 9, 40 7 C 62 5, 90 8, 98 18 C 102 25, 94 33, 76 36"
        pathLength="1"
      />
    </svg>
  </span>
</template>
