<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BrandLink from '@/components/header/BrandLink.vue'
import LanguageMenu from '@/components/header/LanguageMenu.vue'
import SoundToggle from '@/components/header/SoundToggle.vue'
import ThemeToggle from '@/components/header/ThemeToggle.vue'
import { useMoscowTime } from '@/composables/useMoscowTime'

const { t } = useI18n()
const { time } = useMoscowTime()

const HEADER_ACTION =
  "size-11 rounded-4 [&_svg:not([class*='size-'])]:size-5 sm:size-8 sm:rounded-2 sm:[&_svg:not([class*='size-'])]:size-4"
</script>

<template>
  <header
    class="print:hidden mx-auto flex h-18 w-full max-w-(--column) items-center gap-(--space-4) px-(--space-6)"
  >
    <BrandLink />

    <span class="ms-auto flex items-center gap-(--space-2)">
      <span class="t-label hidden sm:block">{{ time }} {{ t('common.timezone') }}</span>
      <LanguageMenu :class="HEADER_ACTION" />
      <SoundToggle :class="HEADER_ACTION" />
      <ThemeToggle :class="HEADER_ACTION" />
    </span>
  </header>
</template>
