<script setup lang="ts">
withDefaults(defineProps<{ title: string; stacked?: boolean }>(), { stacked: false })
</script>

<template>
  <section
    :class="[
      'grid gap-2',
      stacked ? '' : 'sm:grid-cols-[112px_1fr] sm:gap-6 print:grid-cols-[104px_1fr] print:gap-6',
    ]"
  >
    <h2 :class="['t-label m-0', stacked ? '' : 'sm:pt-0.5 print:pt-0.5']">{{ title }}</h2>
    <div class="flex min-w-0 flex-col gap-(--space-4)">
      <slot />
    </div>
  </section>
</template>
