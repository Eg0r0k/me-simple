<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  invalid?: boolean
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :aria-invalid="props.invalid || undefined"
    :class="
      cn(
        'h-10 w-full min-w-0 rounded-2 bg-sunk px-3 text-[14px] text-fg outline-none',
        'placeholder:text-faint selection:bg-primary selection:text-on-primary',
        '[transition:background-color_var(--dur-hover)_ease,box-shadow_var(--dur-hover)_ease]',
        'focus-visible:shadow-[inset_0_0_0_2px_var(--primary)] focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:text-faint',
        'aria-invalid:bg-danger-soft aria-invalid:text-danger-ink',
        props.class,
      )
    "
  />
</template>
