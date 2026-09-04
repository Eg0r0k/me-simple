<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { Component, HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { TONE_BG, TONE_FG, type Tone } from '@/lib/tone'
import IconCategory from '~icons/material-symbols/category-rounded'

type Variant = 'plate' | 'compact' | 'empty'

interface Props extends PrimitiveProps {
  variant?: Variant
  tone?: Tone
  icon?: Component
  title?: string
  year?: string | number
  caption?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  variant: 'plate',
  tone: 'sky',
})

const icon = computed(() => props.icon ?? IconCategory)

const isEmpty = computed(() => props.variant === 'empty')
const plateBg = computed(() => (isEmpty.value ? 'bg-background' : TONE_BG[props.tone]))
const plateFg = computed(() => (isEmpty.value ? 'text-faint' : TONE_FG[props.tone]))
</script>

<template>
  <Primitive
    data-slot="card"
    :as="as"
    :as-child="asChild"
    :class="
      cn(
        'rounded-card no-underline',
        isEmpty ? 'bg-sunk' : 'bg-surface',
        props.variant === 'compact' ? 'flex items-center gap-3 p-5' : 'flex flex-col gap-3 p-2.5',
        props.class,
      )
    "
  >
    <template v-if="props.variant === 'compact'">
      <span
        :class="cn('flex size-9 shrink-0 items-center justify-center rounded-3', plateBg, plateFg)"
      >
        <component :is="icon" class="size-5 shrink-0" aria-hidden="true" />
      </span>
      <span class="flex min-w-0 flex-col gap-0.5">
        <span class="flex items-center gap-2">
          <span
            :class="
              cn(
                'truncate text-[15.5px] font-semibold leading-[1.3] tracking-[-0.01em]',
                isEmpty ? 'text-faint' : 'text-fg',
              )
            "
            >{{ props.title }}</span
          >
          <span v-if="props.year" class="t-label ms-auto">{{ props.year }}</span>
        </span>
        <span v-if="props.caption" class="t-small truncate">{{ props.caption }}</span>
      </span>
    </template>

    <template v-else>
      <span
        :class="
          cn(
            'flex h-33 shrink-0 items-center justify-center rounded-3',
            plateBg,
            plateFg,
            isEmpty && 'bg-background',
          )
        "
      >
        <component :is="icon" class="size-10 shrink-0" aria-hidden="true" />
      </span>
      <span class="flex flex-col gap-1.5 px-2 pb-2.5 pt-0.5">
        <span class="flex items-center gap-2">
          <span
            :class="
              cn(
                'truncate text-[15.5px] font-semibold leading-[1.3] tracking-[-0.01em]',
                isEmpty ? 'text-faint' : 'text-fg',
              )
            "
            >{{ props.title }}</span
          >
          <span v-if="props.year" class="t-label ms-auto">{{ props.year }}</span>
        </span>
        <span v-if="props.caption" class="t-small truncate leading-normal">{{
          props.caption
        }}</span>
      </span>
      <slot />
    </template>
  </Primitive>
</template>
