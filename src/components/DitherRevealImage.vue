<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDitherReveal } from '@/composables/useDitherReveal'

const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    pxSizeStart?: number
    pxSizeEnd?: number
    ditherPx?: number
    duration?: number
    useAlpha?: boolean
    pixelationSteps?: number[]
    playOnVisible?: boolean
    aspectRatio?: number
  }>(),
  {
    alt: '',
    pxSizeStart: 24,
    pxSizeEnd: 1,
    ditherPx: 1,
    duration: 1600,
    useAlpha: false,
    pixelationSteps: () => [],
    playOnVisible: true,
  },
)

const emit = defineEmits<{ replay: [] }>()

const elRef = ref<HTMLDivElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const intrinsicRatio = ref<number | null>(null)

const { isDone, replay: replayReveal } = useDitherReveal(elRef, () => ({
  src: props.src,
  pxSizeStart: props.pxSizeStart,
  pxSizeEnd: props.pxSizeEnd,
  ditherPx: props.ditherPx,
  duration: props.duration,
  useAlpha: props.useAlpha,
  pixelationSteps: props.pixelationSteps,
  playOnVisible: props.playOnVisible,
}))

const aspectStyle = computed(() => {
  const ratio = props.aspectRatio ?? intrinsicRatio.value
  return ratio ? { aspectRatio: ratio } : {}
})

function onImgLoad() {
  const img = imgRef.value
  if (img?.naturalWidth && img?.naturalHeight) {
    intrinsicRatio.value = img.naturalWidth / img.naturalHeight
  }
}

function replay() {
  replayReveal()
  emit('replay')
}
</script>

<template>
  <div ref="elRef" class="dither-reveal" :style="aspectStyle">
    <img
      ref="imgRef"
      class="dither-reveal__img"
      :class="{ 'dither-reveal__img--hidden': !props.useAlpha }"
      :src="props.src"
      :alt="props.alt"
      loading="eager"
      decoding="async"
      @load="onImgLoad"
    />
    <slot v-if="isDone" name="replay" :replay="replay">
      <button type="button" class="dither-reveal__replay" @click="replay">↺ replay</button>
    </slot>
  </div>
</template>

<style scoped>
.dither-reveal {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.dither-reveal__img {
  display: block;
  width: 100%;
}
/*
 * The real pixels come from the overlay canvas in ditherRevealManager; the <img> only
 * sizes the container. Keep it invisible so the original never flashes before the first
 * overlay frame. In useAlpha mode the shader is transparent, so the image must show through.
 */
.dither-reveal__img--hidden {
  visibility: hidden;
}
.dither-reveal__replay {
  position: absolute;
  bottom: 12px;
  right: 12px;
  font: 12px monospace;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
}
</style>
