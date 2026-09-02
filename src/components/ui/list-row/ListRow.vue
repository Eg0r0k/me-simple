<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import Icon from '@/components/ui/icon/Icon.vue'

type Tone = 'sky' | 'peri' | 'amber' | 'mint' | 'clay'

interface Props extends PrimitiveProps {
  tone?: Tone
  icon?: string
  index?: string | number
  title?: string
  caption?: string
  year?: string | number
  selected?: boolean
  trailingIcon?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'div',
  tone: 'sky',
  icon: 'category',
  selected: false,
  trailingIcon: 'arrow_outward',
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
        'press-scale mx-[-12px] flex items-center gap-[16px] rounded-4 px-[12px] py-[var(--row)] no-underline',
        '[transition:background-color_var(--dur-surface)_ease,transform_var(--dur-press)_var(--ease-standard)]',
        props.selected ? 'bg-sunk' : 'bg-transparent hover:bg-sunk',
        props.class,
      )
    "
  >
    <span
      v-if="useHandIndex"
      class="t-hand w-[24px] shrink-0 text-[20px] text-clay"
      aria-hidden="true"
      >{{ props.index }}</span
    >
    <span
      v-else
      :class="
        cn(
          'flex size-[38px] shrink-0 items-center justify-center rounded-3',
          TONE_BG[props.tone],
          TONE_FG[props.tone],
        )
      "
    >
      <Icon :name="props.icon" size="md" />
    </span>

    <span class="flex min-w-0 flex-1 flex-col gap-[4px]">
      <span class="flex min-w-0 items-baseline gap-[8px]">
        <span class="truncate text-[15.5px] font-semibold tracking-[-0.012em] text-fg">{{
          props.title
        }}</span>
        <span v-if="props.caption" class="t-small hidden truncate sm:block">{{
          props.caption
        }}</span>
      </span>
      <slot />
    </span>

    <span class="flex shrink-0 items-center gap-[12px]">
      <span v-if="props.year" class="t-label">{{ props.year }}</span>
      <Icon v-if="props.trailingIcon" :name="props.trailingIcon" size="sm" class="text-faint" />
    </span>
  </Primitive>
</template>
