<template>
  <div class="relative h-full">
    <Scrollable class="absolute inset-0">
      <div class="grid w-fit grid-cols-2 p-2">
        <!-- <DitherRevealImage
          class="max-w-100"
          src="/oleg.jfif"
          :px-size-start="128"
          :px-size-end="1"
          :pixelation-steps="[128, 64, 32, 16, 8, 4, 2, 1]"
          :duration="1350"
          :use-alpha="false"
          :play-on-visible="true"
        />
        <DitherRevealImage
          src="/a1f1867a-b848-40ab-a952-cec4f93eba2d.jfif"
          class="max-w-60"
          :px-size-start="128"
          :px-size-end="1"
          :pixelation-steps="[128, 64, 32, 16, 8, 4, 2, 1]"
          :duration="1500"
          :use-alpha="false"
          :play-on-visible="true"
        /> -->
      </div>
    </Scrollable>

    <DraggableWindow
      v-if="showNotes"
      :initial-x="300"
      :initial-y="80"
      :z-index="30"
      @close="showNotes = false"
    >
      <template #title>preview</template>
      <div class="p-2">
        <DitherRevealImage
          src="/a1f1867a-b848-40ab-a952-cec4f93eba2d.jfif"
          class="w-auto h-full"
          :px-size-start="128"
          :px-size-end="1"
          :pixelation-steps="[128, 64, 32, 16, 8, 4, 2, 1]"
          :duration="1500"
          :use-alpha="false"
          :play-on-visible="true"
        />
      </div>
    </DraggableWindow>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DitherRevealImage from '@/components/DitherRevealImage.vue'
import { Scrollable } from '@/components/ui/scrollable'
import { DraggableWindow } from '@/components/ui/draggable-window'

const showNotes = ref(true)
</script>
