<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
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
import { ROUTE_NAMES } from '@/router/route-names'
import { routeLocation } from '@/router/route-locations'

const { t } = useI18n()
const route = useRoute()
const { isDark, toggleTheme } = useTheme()
const { language, languages, setLanguage } = useLocale()
const { cue } = useSound()

const isHome = computed(() => route.name === ROUTE_NAMES.HOME)

// §3.12: на телефоне тап-таргет 44px (радиус 14 по §4), с sm — обычный icon-sm 32/10.
const HEADER_ACTION =
  "size-[44px] rounded-4 [&_svg:not([class*='size-'])]:size-[20px] sm:size-[32px] sm:rounded-2 sm:[&_svg:not([class*='size-'])]:size-[16px]"

const switchTheme = (event: MouseEvent) => {
  cue('toggle')
  void toggleTheme(event)
}

const selectLanguage = (code: SupportedLanguage) => {
  cue('tick')
  setLanguage(code)
}

const time = ref('')
let timer: ReturnType<typeof setInterval>

function updateTime() {
  time.value = new Date().toLocaleTimeString('ru-RU', {
    timeZone: 'Europe/Moscow',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => clearInterval(timer))
</script>

<template>
  <header
    class="mx-auto flex h-[72px] w-full max-w-[var(--column)] items-center gap-[var(--space-4)] px-[var(--space-6)]"
  >
    <RouterLink
      :to="routeLocation.home()"
      class="press-scale t-subheading shrink-0 rounded-2 no-underline"
      :aria-current="isHome ? 'page' : undefined"
    >
      {{ t('common.brand') }}
    </RouterLink>

    <span class="ms-auto flex items-center gap-[var(--space-2)]">
      <span class="t-label hidden sm:block">{{ time }} {{ t('common.timezone') }}</span>

      <DropdownMenu>
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
