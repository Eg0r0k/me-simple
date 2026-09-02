<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '.'
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from '.'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), { as: 'button' })

const isIconOnly = computed(() => Boolean(props.size?.startsWith('icon')))

const resolvedVariant = computed<ButtonVariants['variant']>(
  () => props.variant ?? (isIconOnly.value ? 'surface' : 'primary'),
)
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="resolvedVariant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant: resolvedVariant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
