<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import IconLightMode from '~icons/material-symbols/light-mode-rounded'
import IconDarkMode from '~icons/material-symbols/dark-mode-rounded'
import { useTheme } from '@/composables/useTheme'
import { useSound } from '@/composables/useSound'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const { t } = useI18n()
const { isDark, toggleTheme } = useTheme()
const { cue } = useSound()

const onClick = (event: MouseEvent) => {
  cue('toggle')
  void toggleTheme(event)
}
</script>

<template>
  <Button
    variant="ghost"
    size="icon-sm"
    :class="props.class"
    :aria-label="isDark ? t('common.theme.toLight') : t('common.theme.toDark')"
    @click="onClick"
  >
    <component :is="isDark ? IconLightMode : IconDarkMode" aria-hidden="true" />
  </Button>
</template>
