<script setup lang="ts">
import type { Component } from 'vue'
import { externalLinkAttrs } from '@/lib/links'

defineProps<{
  label: string
  url: string
  icon: Component
}>()
</script>

<template>
  <a
    v-bind="externalLinkAttrs(url)"
    class="press-scale inline-flex items-center gap-1 rounded-xs px-1.5 py-0.75 text-[13px] text-muted-foreground no-underline [transition:background-color_var(--dur-hover)_ease,color_var(--dur-hover)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:bg-sunk hover:text-fg"
  >
    <component :is="icon" class="size-3.75 shrink-0" aria-hidden="true" />
    {{ label }}
  </a>
</template>
