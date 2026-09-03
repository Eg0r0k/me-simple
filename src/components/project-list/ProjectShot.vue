<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import type { PreviewLocale, Project, ProjectTone } from '@/data/projects'
import { resolvePreviewSrc } from './preview'

const props = defineProps<{
  project: Project
  locale: PreviewLocale
}>()

const src = computed(() => resolvePreviewSrc(props.project.preview, props.locale))

const img = useTemplateRef<HTMLImageElement>('img')
const loaded = ref(false)

onMounted(() => {
  const el = img.value
  if (el && el.complete && el.naturalWidth > 0) loaded.value = true
})

watch(src, () => {
  loaded.value = false
})

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
    <img
      v-if="src"
      ref="img"
      :src="src"
      alt=""
      decoding="async"
      fetchpriority="low"
      draggable="false"
      :class="[
        'absolute inset-0 size-full object-cover object-left-top select-none [transition:opacity_var(--dur-reveal)_var(--ease-standard)] motion-reduce:transition-none',
        loaded ? 'opacity-100' : 'opacity-0',
      ]"
      @load="loaded = true"
    />
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
