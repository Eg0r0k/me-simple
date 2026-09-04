<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import IconTranslate from '~icons/material-symbols/translate-rounded'
import IconCheck from '~icons/material-symbols/check-rounded'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SupportedLanguage } from '@/app/i18n/languages'
import { useLocale } from '@/composables/useLocale'
import { useSound } from '@/composables/useSound'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const { t } = useI18n()
const { language, languages, setLanguage } = useLocale()
const { cue } = useSound()

let closedBySelect = false

const onToggle = (open: boolean) => {
  if (open) {
    cue('bloom')
    return
  }
  if (closedBySelect) {
    closedBySelect = false
    return
  }
  cue('whisper')
}

const select = (code: SupportedLanguage) => {
  closedBySelect = true
  cue('tick')
  setLanguage(code)
}
</script>

<template>
  <DropdownMenu @update:open="onToggle">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon-sm"
        :class="props.class"
        :aria-label="t('common.language.trigger')"
      >
        <IconTranslate aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-42">
      <DropdownMenuLabel>{{ t('common.language.label') }}</DropdownMenuLabel>
      <DropdownMenuItem
        v-for="option in languages"
        :key="option.code"
        @select="select(option.code)"
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
</template>
