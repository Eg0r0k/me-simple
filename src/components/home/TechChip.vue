<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  url: string
  icon: Component
}>()
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="press-scale inline-flex items-center gap-[4px] rounded-xs px-[6px] py-[3px] text-[13px] text-muted-foreground no-underline [transition:background-color_var(--dur-hover)_ease,color_var(--dur-hover)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:bg-sunk hover:text-fg"
  >
    <component :is="icon" class="size-[15px] shrink-0" aria-hidden="true" />
    {{ label }}
  </a>
</template>
