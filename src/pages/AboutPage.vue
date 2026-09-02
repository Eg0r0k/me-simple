<template>
  <div class="flex flex-col gap-[var(--space-8)] pt-[var(--space-12)]">
    <header class="flex flex-col gap-[var(--space-3)]">
      <span class="t-label">{{ t('about.meta') }}</span>
      <h1 class="t-title">{{ t('about.title') }}</h1>
    </header>

    <div class="grid gap-[var(--space-8)] sm:grid-cols-[1fr_260px]">
      <div class="flex flex-col gap-[var(--space-4)]">
        <p class="t-body text-muted-foreground">{{ t('about.p1') }}</p>
        <p class="t-body text-muted-foreground">{{ t('about.p2') }}</p>

        <div class="flex flex-wrap gap-[var(--space-2)] pt-[var(--space-2)]">
          <Badge v-for="skill in skills" :key="skill.label" :tone="skill.tone" :icon="skill.icon">
            {{ skill.label }}
          </Badge>
        </div>
      </div>

      <Frame
        ratio="crop"
        radius="alone"
        tone="peri"
        icon="person"
        :caption="t('about.frame.caption')"
        :note="t('about.frame.note')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Frame } from '@/components/ui/frame'

const { t } = useI18n()

/* Названия технологий — имена собственные, не переводятся. */
const skills: { label: string; tone: BadgeTone; icon: string }[] = [
  { label: 'Vue 3', tone: 'mint', icon: 'code' },
  { label: 'TypeScript', tone: 'sky', icon: 'terminal' },
  { label: 'WebGL', tone: 'peri', icon: 'deployed_code' },
]
</script>
