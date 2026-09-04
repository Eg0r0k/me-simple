<script setup lang="ts">
import { onScopeDispose, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconCopy from '~icons/material-symbols/content-copy-rounded'

const props = defineProps<{ email: string }>()
const { t } = useI18n()

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
  clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
  }, 1400)
}

onScopeDispose(() => clearTimeout(timer), true)
</script>

<template>
  <span class="inline-flex flex-wrap items-center gap-[12px]">
    <button
      type="button"
      class="group press-scale inline-flex items-center gap-[8px] m-0 cursor-pointer bg-transparent p-0 text-left text-[24px] leading-[1.15] font-semibold tracking-[-0.024em] text-fg"
      :aria-label="`${email}, ${t('contact.copy')}`"
      @click="copy"
    >
      <span class="relative">
        {{ email }}
        <span
          class="absolute inset-x-0 -bottom-[4px] h-[3px] origin-left scale-x-0 rounded-[2px] bg-primary [transition:scale_0.35s_var(--ease-standard)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </span>
      <IconCopy class="size-[18px] shrink-0 text-faint" aria-hidden="true" />
    </button>
    <span
      class="t-small text-primary [transition:opacity_var(--dur-hover)_ease]"
      :class="copied ? 'opacity-100' : 'opacity-0'"
      aria-live="polite"
    >
      {{ copied ? t('contact.copied') : '' }}
    </span>
  </span>
</template>
