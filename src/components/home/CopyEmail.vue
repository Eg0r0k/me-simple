<script setup lang="ts">
import { onScopeDispose, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconCopy from '~icons/material-symbols/content-copy-rounded'
import IconCheck from '~icons/material-symbols/check-rounded'
import { useSound } from '@/composables/useSound'

const props = defineProps<{ email: string }>()
const { t } = useI18n()
const { cue } = useSound()

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  const clipboard = navigator.clipboard
  if (!clipboard) return
  try {
    await clipboard.writeText(props.email)
  } catch {
    return
  }
  copied.value = true
  cue('success')
  clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
  }, 1400)
}

onScopeDispose(() => clearTimeout(timer), true)
</script>

<template>
  <button
    type="button"
    class="group press-scale m-0 inline-flex cursor-pointer items-center gap-2 bg-transparent p-0 text-left text-[24px] leading-[1.15] font-semibold tracking-[-0.024em] text-fg"
    :aria-label="`${email}, ${t('contact.copy')}`"
    @click="copy"
  >
    <span class="relative">
      {{ email }}
      <span
        class="absolute inset-x-0 -bottom-1 h-0.75 origin-left scale-x-0 rounded-[2px] bg-primary [transition:scale_0.35s_var(--ease-standard)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </span>
    <span class="relative size-4.5 shrink-0" aria-hidden="true">
      <IconCopy
        data-icon="copy"
        :class="[
          'absolute inset-0 size-full text-faint [transition:opacity_220ms_var(--ease-standard),scale_220ms_var(--ease-standard),rotate_220ms_var(--ease-standard)] motion-reduce:[transition:opacity_220ms_var(--ease-standard)] motion-reduce:scale-100 motion-reduce:rotate-0',
          copied ? 'opacity-0 scale-50 rotate-45' : 'opacity-100 scale-100 rotate-0',
        ]"
      />
      <IconCheck
        data-icon="check"
        :class="[
          'absolute inset-0 size-full text-primary [transition:opacity_220ms_var(--ease-standard),scale_220ms_var(--ease-standard),rotate_220ms_var(--ease-standard)] motion-reduce:[transition:opacity_220ms_var(--ease-standard)] motion-reduce:scale-100 motion-reduce:rotate-0',
          copied ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-45',
        ]"
      />
    </span>
    <span class="sr-only" aria-live="polite">{{ copied ? t('contact.copied') : '' }}</span>
  </button>
</template>
