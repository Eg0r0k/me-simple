<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import type { BadgeVariants } from '.'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { badgeVariants } from '.'
import Icon from '@/components/ui/icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    size?: BadgeVariants['size']
    tone?: BadgeVariants['tone']
    /** Имя Material Symbols. Отменяет `dot`. */
    icon?: string
    /** Точка 6×6 в цвете текста. Игнорируется, если задана иконка. */
    dot?: boolean
    class?: HTMLAttributes['class']
  }>(),
  { size: 'md', tone: 'secondary', dot: false },
)

const showDot = computed(() => props.dot && !props.icon)
const leading = computed(() => Boolean(props.icon) || showDot.value)
</script>

<template>
  <span
    data-slot="badge"
    :class="
      cn(badgeVariants({ size: props.size, tone: props.tone, leading: leading }), props.class)
    "
  >
    <Icon v-if="props.icon" :name="props.icon" :size="props.size === 'sm' ? 13 : 15" />
    <span v-else-if="showDot" class="size-[6px] shrink-0 rounded-full bg-current" />
    <slot />
  </span>
</template>
