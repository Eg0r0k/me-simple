<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { Component, HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import type { Tone } from '@/lib/tone'
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'

interface Props extends PrimitiveProps {
  tone?: Tone
  icon?: Component
  index?: string | number
  title?: string
  caption?: string
  year?: string | number
  selected?: boolean
  trailingIcon?: Component | null
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  tone: 'sky',
  selected: false,
})

const trailingIcon = computed(() =>
  props.trailingIcon === undefined ? IconArrowOutward : props.trailingIcon,
)

const useHandIndex = computed(() => props.index !== undefined)
</script>

<template>
  <Primitive
    data-slot="list-row"
    :as="as"
    :as-child="asChild"
    :data-selected="props.selected ? '' : undefined"
    :class="
      cn(
        'press-scale -mx-3 flex items-center gap-4 rounded-4 px-3 py-(--row) no-underline',
        '[transition:background-color_var(--dur-surface)_ease,transform_var(--dur-press)_var(--ease-standard)]',
        props.selected ? 'bg-sunk' : 'bg-transparent hover:bg-sunk',
        props.class,
      )
    "
  >
    <span
      v-if="useHandIndex"
      class="t-hand items-center justify-center shrink-0 text-[20px]"
      aria-hidden="true"
      >{{ props.index }}</span
    >

    <span class="flex min-w-0 flex-1 flex-col gap-1">
      <span class="flex min-w-0 items-baseline gap-2">
        <span class="truncate text-[15.5px] font-semibold tracking-[-0.012em] text-fg">{{
          props.title
        }}</span>
        <span v-if="props.caption" class="t-small hidden truncate sm:block">{{
          props.caption
        }}</span>
      </span>
      <slot />
    </span>

    <span class="flex shrink-0 items-center gap-3">
      <span v-if="props.year" class="t-label">{{ props.year }}</span>
      <component
        :is="trailingIcon"
        v-if="trailingIcon"
        class="size-5 shrink-0 text-faint"
        aria-hidden="true"
      />
    </span>
  </Primitive>
</template>
