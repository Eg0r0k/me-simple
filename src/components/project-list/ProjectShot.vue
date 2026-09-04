<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import type { PreviewLocale, Project, ProjectTone } from '@/data/projects'
import { resolvePreviewSrc } from './preview'

const props = defineProps<{
  project: Project
  locale: PreviewLocale
}>()

const src = computed(() => resolvePreviewSrc(props.project.preview, props.locale))

interface Layer {
  src: string
  loaded: boolean
}

// Должно совпадать с токеном --dur-reveal (300ms); менять оба вместе.
const REVEAL_MS = 300
const layers = ref<Layer[]>([])
let sweep: ReturnType<typeof setTimeout> | undefined

// Новый кадр ложится сверху; старый остаётся, пока новый не загрузился.
watch(
  src,
  (next) => {
    if (!next) {
      layers.value = []
      return
    }
    // Кадр уже есть в стопке (напр. быстрое ru→en→ru) — не дублировать слой,
    // а вернуть его на вершину, обрезав всё, что успело лечь сверху.
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

// Мутация layers.value прямо во время рендера (ref-колбэк) — намеренно;
// сходится благодаря guard !layer.loaded, повторный рендер его не зациклит.
// Кадр из кэша может быть готов до того, как навесится обработчик load.
function checkComplete(el: unknown, layer: Layer) {
  if (el instanceof HTMLImageElement && el.complete && el.naturalWidth > 0 && !layer.loaded) {
    markLoaded(layer)
  }
}

const TONE_BG: Record<ProjectTone, string> = {
  sky: 'bg-sky-soft',
  peri: 'bg-peri-soft',
  amber: 'bg-amber-soft',
  mint: 'bg-mint-soft',
  clay: 'bg-clay-soft',
}

const TONE_INK: Record<ProjectTone, string> = {
  sky: 'text-sky-ink',
  peri: 'text-peri-ink',
  amber: 'text-amber-ink',
  mint: 'text-mint-ink',
  clay: 'text-clay-ink',
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
