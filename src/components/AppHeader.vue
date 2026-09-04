<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch, type ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import IconTranslate from '~icons/material-symbols/translate-rounded'
import IconCheck from '~icons/material-symbols/check-rounded'
import IconLightMode from '~icons/material-symbols/light-mode-rounded'
import IconDarkMode from '~icons/material-symbols/dark-mode-rounded'
import SoundToggle from '@/components/SoundToggle.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SupportedLanguage } from '@/app/i18n/languages'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'
import { useSound } from '@/composables/useSound'
import { useAnger } from '@/composables/useAnger'
import { useMoscowTime } from '@/composables/useMoscowTime'
import { routeLocation } from '@/router/route-locations'
import { usePreferredReducedMotion } from '@vueuse/core'

const { t } = useI18n()
const { isDark, toggleTheme } = useTheme()
const { language, languages, setLanguage } = useLocale()
const { cue } = useSound()

const { level: anger, shakeKey, poke } = useAnger()
const shaking = ref(false)
const brand = useTemplateRef<ComponentPublicInstance>('brand')
const reduced = usePreferredReducedMotion()

// Повторный клик во время тряски: снять класс, форсировать пересчёт стилей и вернуть, чтобы анимация началась заново.
watch(shakeKey, async () => {
  if (reduced.value === 'reduce') return
  shaking.value = false
  await nextTick()
  const el = brand.value?.$el as HTMLElement | undefined
  void el?.offsetWidth // форсируем пересчёт стилей, иначе анимация не перезапустится
  shaking.value = true
})

const onBrandClick = () => {
  cue('tick')
  poke()
}

// Флаг гасит whisper от закрытия меню, если оно закрылось из-за выбора языка (там уже играет tick).
let selecting = false
const onMenuToggle = (open: boolean) => {
  if (open) {
    cue('bloom')
    return
  }
  if (selecting) {
    selecting = false
    return
  }
  cue('whisper')
}

// На телефоне тап-таргет 44px, с sm и шире — обычный icon-sm 32px.
const HEADER_ACTION =
  "size-[44px] rounded-4 [&_svg:not([class*='size-'])]:size-[20px] sm:size-[32px] sm:rounded-2 sm:[&_svg:not([class*='size-'])]:size-[16px]"

const switchTheme = (event: MouseEvent) => {
  cue('toggle')
  void toggleTheme(event)
}

const selectLanguage = (code: SupportedLanguage) => {
  selecting = true
  cue('tick')
  setLanguage(code)
}

const { time } = useMoscowTime()
</script>

<template>
  <header
    class="mx-auto flex h-[72px] w-full max-w-[var(--column)] items-center gap-[var(--space-4)] px-[var(--space-6)]"
  >
    <RouterLink
      ref="brand"
      :to="routeLocation.home()"
      class="brand-anger press-scale t-subheading shrink-0 rounded-2 no-underline"
      :class="{ 'is-shaking': shaking }"
      :style="{ '--anger': anger }"
      @click="onBrandClick"
      @animationend.self="shaking = false"
    >
      {{ t('common.brand') }}
    </RouterLink>

    <span class="ms-auto flex items-center gap-[var(--space-2)]">
      <span class="t-label hidden sm:block">{{ time }} {{ t('common.timezone') }}</span>

      <DropdownMenu @update:open="onMenuToggle">
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon-sm"
            :class="HEADER_ACTION"
            :aria-label="t('common.language.trigger')"
          >
            <IconTranslate aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-[168px]">
          <DropdownMenuLabel>{{ t('common.language.label') }}</DropdownMenuLabel>
          <DropdownMenuItem
            v-for="option in languages"
            :key="option.code"
            @select="selectLanguage(option.code)"
          >
            {{ option.code === 'system' ? t('common.language.system') : option.native }}
            <IconCheck
              v-if="option.code === language"
              class="ms-auto size-5 text-primary"
              aria-hidden="true"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SoundToggle :class="HEADER_ACTION" />

      <Button
        variant="ghost"
        size="icon-sm"
        :class="HEADER_ACTION"
        :aria-label="isDark ? t('common.theme.toLight') : t('common.theme.toDark')"
        @click="switchTheme"
      >
        <component :is="isDark ? IconLightMode : IconDarkMode" aria-hidden="true" />
      </Button>
    </span>
  </header>
</template>
