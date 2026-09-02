<script setup lang="ts">
import type { DropdownMenuCheckboxItemEmits, DropdownMenuCheckboxItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { Icon } from '@/components/ui/icon'
import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<DropdownMenuCheckboxItemProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<DropdownMenuCheckboxItemEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DropdownMenuCheckboxItem
    data-slot="dropdown-menu-checkbox-item"
    v-bind="forwarded"
    :class="
      cn(
        'focus:bg-fill focus:text-accent-foreground relative flex h-[34px] cursor-default select-none items-center gap-2 rounded-1 pe-[10px] ps-8 text-[14px] outline-hidden data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4',
        props.class,
      )
    "
  >
    <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuItemIndicator>
        <slot name="indicator-icon">
          <Icon name="check" :size="16" class="text-primary" />
        </slot>
      </DropdownMenuItemIndicator>
    </span>
    <slot />
  </DropdownMenuCheckboxItem>
</template>
