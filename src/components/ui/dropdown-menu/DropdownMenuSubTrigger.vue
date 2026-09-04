<script setup lang="ts">
import type { DropdownMenuSubTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import IconChevronRight from '~icons/material-symbols/chevron-right-rounded'
import { reactiveOmit } from '@vueuse/core'
import { DropdownMenuSubTrigger, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<
  DropdownMenuSubTriggerProps & { class?: HTMLAttributes['class']; inset?: boolean }
>()

const delegatedProps = reactiveOmit(props, 'class', 'inset')
const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuSubTrigger
    data-slot="dropdown-menu-sub-trigger"
    v-bind="forwardedProps"
    :data-inset="inset ? '' : undefined"
    :class="
      cn(
        'focus:bg-fill focus:text-accent-foreground data-[state=open]:bg-fill data-[state=open]:text-accent-foreground relative flex h-8.5 cursor-default select-none items-center gap-2 rounded-1 px-2.5 text-[14px] outline-hidden data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive! [&_svg:not([class*=\'text-\'])]:text-muted-foreground',
        props.class,
      )
    "
  >
    <slot />
    <IconChevronRight class="ms-auto size-4.5 text-faint" aria-hidden="true" />
  </DropdownMenuSubTrigger>
</template>
