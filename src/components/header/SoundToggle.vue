<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import IconVolumeUp from '~icons/material-symbols/volume-up-rounded'
import IconVolumeOff from '~icons/material-symbols/volume-off-rounded'
import { useSound } from '@/composables/useSound'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const { t } = useI18n()
const { soundEnabled, toggleSound } = useSound()
</script>

<template>
  <Button
    variant="ghost"
    size="icon-sm"
    :class="props.class"
    :aria-pressed="soundEnabled"
    :aria-label="soundEnabled ? t('common.sound.toOff') : t('common.sound.toOn')"
    @click="toggleSound"
  >
    <component :is="soundEnabled ? IconVolumeUp : IconVolumeOff" aria-hidden="true" />
  </Button>
</template>
