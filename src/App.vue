<template>
  <MotionConfig :reduced-motion="'user'">
    <div class="min-h-screen bg-background">
      <AppHeader />

      <main class="pb-[var(--space-20)]">
        <RouterView />
      </main>
    </div>
  </MotionConfig>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { MotionConfig } from 'motion-v'
import AppHeader from '@/components/AppHeader.vue'
import { useLocale } from '@/composables/useLocale'

const { init: initLocale } = useLocale()

onMounted(() => {
  initLocale()
})
</script>
