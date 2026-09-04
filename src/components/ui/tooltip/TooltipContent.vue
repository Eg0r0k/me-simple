<script setup lang="ts">
import type { TooltipContentEmits, TooltipContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { TooltipContent, TooltipPortal, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<TooltipContentProps & { class?: HTMLAttributes['class'] }>(),
  {
    side: 'bottom',
    sideOffset: 8,
  },
)
const emits = defineEmits<TooltipContentEmits>()
const forwarded = useForwardPropsEmits(reactiveOmit(props, 'class'), emits)
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      data-slot="tooltip-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="
        cn(
          'z-50 rounded-2 bg-raised px-[10px] py-[6px] t-code text-[13px] text-fg shadow-2',
          'data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:slide-in-from-top-1 data-[state=instant-open]:animate-in data-[state=instant-open]:fade-in-0 data-[state=instant-open]:slide-in-from-top-1 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 motion-reduce:slide-in-from-top-0',
          props.class,
        )
      "
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
