<script setup lang="ts">
import { ref } from 'vue'
import { useDitherBackground, type DitherOptions } from '@/composables/UseDitherBackground'

const props = withDefaults(defineProps<DitherOptions>(), {
  colorA: '#000000',
  colorB: '#ffffff',
  pxSize: 4,
  ditherType: 3,
  ditherStrength: 0.4,
  videoSrc: '/background.mp4',
  imageSrc: undefined,
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const open = ref(false)

const controls = useDitherBackground(canvasRef, {
  colorA: props.colorA,
  colorB: props.colorB,
  pxSize: props.pxSize,
  ditherType: props.ditherType,
  ditherStrength: props.ditherStrength,
  videoSrc: props.videoSrc,
  imageSrc: props.imageSrc,
})
</script>

<template>
  <div class="size-full relative">
    <canvas ref="canvasRef" class="dither-bg" />
    <div class="absolute inset-0 bg-black/35" />

    <div class="absolute top-2 right-2 z-50 font-mono text-xs">
      <!-- <button
        class="px-3 py-1.5 border border-border bg-background/80 backdrop-blur cursor-pointer select-none"
        @click="open = !open"
      >
        {{ open ? '✕ close' : '⚙ settings' }}
      </button> -->

      <div
        v-show="open"
        class="absolute top-full right-0 mt-2 w-72 border border-border bg-background/95 backdrop-blur p-4 space-y-3"
      >
        <label class="block">
          <span class="text-foreground/60">colorA (фон)</span>
          <input
            type="color"
            class="block w-full h-8 mt-1 cursor-pointer border border-border bg-transparent"
            :value="controls.colorA.value"
            @input="controls.colorA.value = ($event.target as HTMLInputElement).value"
          />
        </label>

        <label class="block">
          <span class="text-foreground/60">colorB (чернила)</span>
          <input
            type="color"
            class="block w-full h-8 mt-1 cursor-pointer border border-border bg-transparent"
            :value="controls.colorB.value"
            @input="controls.colorB.value = ($event.target as HTMLInputElement).value"
          />
        </label>

        <label class="block">
          <span class="text-foreground/60">pxSize {{ controls.pxSize.value }}</span>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            class="block w-full mt-1 cursor-pointer"
            :value="controls.pxSize.value"
            @input="controls.pxSize.value = parseFloat(($event.target as HTMLInputElement).value)"
          />
        </label>

        <label class="block">
          <span class="text-foreground/60"
            >dither strength {{ controls.ditherStrength.value.toFixed(2) }}</span
          >
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            class="block w-full mt-1 cursor-pointer"
            :value="controls.ditherStrength.value"
            @input="
              controls.ditherStrength.value = parseFloat(($event.target as HTMLInputElement).value)
            "
          />
        </label>

        <label class="block">
          <span class="text-foreground/60">dither type</span>
          <select
            class="block w-full mt-1 border border-border bg-background cursor-pointer px-2 py-1"
            :value="controls.ditherType.value"
            @change="
              controls.ditherType.value = parseInt(($event.target as HTMLSelectElement).value)
            "
          >
            <option :value="1">random</option>
            <option :value="2">Bayer 2×2</option>
            <option :value="3">Bayer 4×4</option>
            <option :value="4">Bayer 8×8</option>
          </select>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dither-bg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
