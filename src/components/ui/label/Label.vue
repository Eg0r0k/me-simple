<script setup lang="ts">
import type { LabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Label } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <Label
    data-slot="label"
    v-bind="delegatedProps"
    :class="
      cn(
        't-label flex select-none items-center gap-[6px] text-muted-foreground group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:text-faint peer-disabled:cursor-not-allowed peer-disabled:text-faint',
        props.class,
      )
    "
  >
    <slot />
  </Label>
</template>
