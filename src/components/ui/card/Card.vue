<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import Icon from '@/components/ui/icon/Icon.vue'

/**
 * §5.6 Card. Тинт — то, чем проекты отличаются друг от друга:
 * ни тумбнейлов, ни рядов тегов, ни двойной меты.
 * `plate` — сетка избранного, `compact` — плотный список, `empty` — пустой слот.
 */

type Tone = 'sky' | 'peri' | 'amber' | 'mint' | 'clay'
type Variant = 'plate' | 'compact' | 'empty'

interface Props extends PrimitiveProps {
  variant?: Variant
  tone?: Tone
  icon?: string
  title?: string
  /** Мета: год. Моно 11px, справа. */
  year?: string | number
  caption?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  variant: 'plate',
  tone: 'sky',
  icon: 'category',
})

const TONE_BG: Record<Tone, string> = {
  sky: 'bg-sky-soft',
  peri: 'bg-peri-soft',
  amber: 'bg-amber-soft',
  mint: 'bg-mint-soft',
  clay: 'bg-clay-soft',
}

const TONE_FG: Record<Tone, string> = {
  sky: 'text-sky',
  peri: 'text-peri',
  amber: 'text-amber',
  mint: 'text-mint',
  clay: 'text-clay',
}

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
        props.variant === 'compact'
          ? 'flex items-center gap-[12px] p-[20px]'
          : 'flex flex-col gap-[12px] p-[10px]',
        props.class,
      )
    "
  >
    <template v-if="props.variant === 'compact'">
      <span
        :class="
          cn('flex size-[36px] shrink-0 items-center justify-center rounded-3', plateBg, plateFg)
        "
      >
        <Icon :name="props.icon" size="md" />
      </span>
      <span class="flex min-w-0 flex-col gap-[2px]">
        <span class="flex items-center gap-[8px]">
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
            'flex h-[132px] shrink-0 items-center justify-center rounded-3',
            plateBg,
            plateFg,
            isEmpty && 'bg-background',
          )
        "
      >
        <Icon :name="props.icon" :size="40" />
      </span>
      <span class="flex flex-col gap-[6px] px-[8px] pb-[10px] pt-[2px]">
        <span class="flex items-center gap-[8px]">
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
        <span v-if="props.caption" class="t-small truncate leading-[1.5]">{{ props.caption }}</span>
      </span>
      <slot />
    </template>
  </Primitive>
</template>
