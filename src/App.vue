<template>
  <MotionConfig :reduced-motion="'user'">
    <div class="flex h-dvh flex-col bg-background">
      <AppHeader class="shrink-0" />

      <Scrollable ref="scrollable" class="min-h-0 flex-1">
        <main class="pb-[var(--space-20)]">
          <RouterView />
        </main>
      </Scrollable>
    </div>
  </MotionConfig>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { MotionConfig } from 'motion-v'
import AppHeader from '@/components/AppHeader.vue'
import { Scrollable } from '@/components/ui/scrollable'
import { useLocale } from '@/composables/useLocale'
import { useScrollMemory } from '@/composables/useScrollMemory'

const { init: initLocale } = useLocale()
const router = useRouter()
const scrollable = useTemplateRef<InstanceType<typeof Scrollable>>('scrollable')

useScrollMemory(router, () => {
  const container = scrollable.value?.container
  if (!container) return null
  return {
    get: () => container.scrollTop,
    set: (position) => {
      container.scrollTop = position
    },
  }
})

onMounted(() => {
  initLocale()
})
</script>
