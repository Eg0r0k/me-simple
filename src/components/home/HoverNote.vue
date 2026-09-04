<script setup lang="ts">
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

defineProps<{
  title: string
  text?: string
  href?: string
  dot?: boolean
}>()
</script>

<template>
  <HoverCard>
    <HoverCardTrigger as-child>
      <a
        v-if="href"
        :href="href"
        class="press-scale inline-block text-primary underline decoration-primary/35 decoration-[1.5px] underline-offset-[3px] [transition:text-decoration-color_var(--dur-hover)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:decoration-primary"
      >
        <slot />
      </a>
      <span
        v-else
        tabindex="0"
        class="cursor-default rounded-[2px] text-fg underline decoration-faint decoration-dotted decoration-[1.5px] underline-offset-[3px]"
      >
        <slot />
      </span>
    </HoverCardTrigger>
    <HoverCardContent>
      <span class="flex items-center gap-[6px] whitespace-nowrap text-[15.5px] font-semibold tracking-[-0.012em] text-fg">
        <span v-if="dot" class="ds-breathe size-[7px] shrink-0 rounded-full bg-mint" aria-hidden="true" />
        {{ title }}
      </span>
      <span v-if="text" class="t-small break-words">{{ text }}</span>
    </HoverCardContent>
  </HoverCard>
</template>
