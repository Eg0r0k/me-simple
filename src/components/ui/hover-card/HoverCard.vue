<script setup lang="ts">
import type { HoverCardRootEmits, HoverCardRootProps } from 'reka-ui'
import { HoverCardRoot, useForwardPropsEmits } from 'reka-ui'

const props = withDefaults(defineProps<HoverCardRootProps>(), { openDelay: 120, closeDelay: 80 })
const emits = defineEmits<HoverCardRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <HoverCardRoot data-slot="hover-card" v-bind="forwarded">
    <slot />
  </HoverCardRoot>
</template>
