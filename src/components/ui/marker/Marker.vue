<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useElementVisibility, useSupported } from '@vueuse/core'

const el = useTemplateRef<HTMLElement>('el')

// Подложка «прорисовывается» один раз, когда слово впервые попадает в кадр.
// Если наблюдать нечем (нет IntersectionObserver), показываем сразу.
const canObserve = useSupported(() => typeof IntersectionObserver !== 'undefined')
const visible = useElementVisibility(el)
const drawn = ref(!canObserve.value)

watch(visible, (isVisible) => {
  if (isVisible) drawn.value = true
})
</script>

<template>
  <mark ref="el" class="marker" :class="{ 'marker-drawn': drawn }"><slot /></mark>
</template>
