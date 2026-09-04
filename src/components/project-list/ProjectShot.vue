<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import type { PreviewLocale, Project } from '@/data/projects'
import { TONE_BG, TONE_INK } from '@/lib/tone'
import { publicUrl } from '@/lib/site'
import { resolvePreviewSrc } from './preview'

const props = defineProps<{
  project: Project
  locale: PreviewLocale
}>()

const src = computed(() => {
  const path = resolvePreviewSrc(props.project.preview, props.locale)
  return path ? publicUrl(path) : null
})

interface Layer {
  src: string
  loaded: boolean
}

// Должно совпадать с токеном --dur-reveal (300ms); менять оба вместе.
const REVEAL_MS = 300
const layers = ref<Layer[]>([])
let sweep: ReturnType<typeof setTimeout> | undefined

watch(
  src,
  (next) => {
    if (!next) {
      layers.value = []
      return
    }
    const index = layers.value.findIndex((layer) => layer.src === next)
    if (index >= 0) {
      layers.value.splice(index + 1)
      return
    }
    layers.value.push({ src: next, loaded: false })
  },
  { immediate: true },
)

function markLoaded(layer: Layer) {
  layer.loaded = true
  clearTimeout(sweep)
  sweep = setTimeout(() => {
    const index = layers.value.indexOf(layer)
    if (index > 0) layers.value.splice(0, index)
  }, REVEAL_MS)
}

onUnmounted(() => clearTimeout(sweep))

function dropLayer(layer: Layer) {
  const index = layers.value.indexOf(layer)
  if (index >= 0) layers.value.splice(index, 1)
}

// Кадр из кэша бывает complete раньше, чем навесится @load; guard по loaded не даёт зациклить рендер.
function checkComplete(el: unknown, layer: Layer) {
  if (el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0 && !layer.loaded) {
    markLoaded(layer)
  }
}
</script>

<template>
  <div class="relative aspect-video overflow-hidden bg-sunk">
    <template v-if="src">
      <img
        v-for="layer in layers"
        :key="layer.src"
        :ref="(el) => checkComplete(el, layer)"
        :src="layer.src"
        alt=""
        decoding="async"
        fetchpriority="low"
        draggable="false"
        :class="[
          'absolute inset-0 size-full object-cover object-left-top select-none [transition:opacity_var(--dur-reveal)_var(--ease-standard)] motion-reduce:transition-none',
          layer.loaded ? 'opacity-100' : 'opacity-0',
        ]"
        @load="markLoaded(layer)"
        @error="dropLayer(layer)"
      />
    </template>
    <div
      v-else-if="project.preview.kind === 'command'"
      :class="[
        'absolute inset-0 flex items-center justify-center t-code text-[14px]',
        TONE_BG[project.tone],
        TONE_INK[project.tone],
      ]"
    >
      {{ project.preview.command }}
    </div>
  </div>
</template>
