<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch, type ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { usePreferredReducedMotion } from '@vueuse/core'
import { useAnger } from '@/composables/useAnger'
import { useSound } from '@/composables/useSound'
import { routeLocation } from '@/router/route-locations'

const { t } = useI18n()
const { cue } = useSound()
const { level: anger, shakeKey, poke } = useAnger()
const reduced = usePreferredReducedMotion()

const shaking = ref(false)
const brand = useTemplateRef<ComponentPublicInstance>('brand')

// Снять класс и вернуть его после reflow, иначе повторный клик не перезапустит анимацию.
watch(shakeKey, async () => {
  if (reduced.value === 'reduce') return
  shaking.value = false
  await nextTick()
  const el = brand.value?.$el as HTMLElement | undefined
  void el?.offsetWidth
  shaking.value = true
})

const onClick = () => {
  cue('tick')
  poke()
}
</script>

<template>
  <RouterLink
    ref="brand"
    :to="routeLocation.home()"
    class="brand-anger press-scale t-subheading shrink-0 rounded-2 no-underline"
    :class="{ 'is-shaking': shaking }"
    :style="{ '--anger': anger }"
    @click="onClick"
    @animationend.self="shaking = false"
  >
    {{ t('common.brand') }}
  </RouterLink>
</template>
