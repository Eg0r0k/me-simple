<template>
  <MotionConfig :reduced-motion="'user'">
    <div class="flex h-dvh flex-col bg-background print:block print:h-auto">
      <AppHeader class="shrink-0" />

      <Scrollable ref="scrollable" class="min-h-0 flex-1" focusable :label="t('common.content')">
        <main class="pb-(--space-20) print:pb-0">
          <RouterView />
        </main>
      </Scrollable>
    </div>
  </MotionConfig>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { MotionConfig } from 'motion-v'
import AppHeader from '@/components/AppHeader.vue'
import { Scrollable } from '@/components/ui/scrollable'
import { useLocale } from '@/composables/useLocale'
import { useScrollMemory } from '@/composables/useScrollMemory'

const { t, locale } = useI18n()
const { init: initLocale } = useLocale()
const router = useRouter()
const scrollable = useTemplateRef<InstanceType<typeof Scrollable>>('scrollable')

useHead({ htmlAttrs: { lang: locale } })

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
