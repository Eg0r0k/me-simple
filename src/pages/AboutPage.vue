<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Badge, type BadgeTone } from '@/components/ui/badge'
import { Frame } from '@/components/ui/frame'
import { ListRow } from '@/components/ui/list-row'
import { experience } from '@/data/resume'

const { t } = useI18n()

const skills: { label: string; tone: BadgeTone; icon: string }[] = [
  { label: 'Vue 3', tone: 'mint', icon: 'code' },
  { label: 'TypeScript', tone: 'sky', icon: 'terminal' },
  { label: 'Tauri', tone: 'peri', icon: 'deployed_code' },
]
</script>

<template>
  <div class="flex flex-col gap-[var(--space-12)] pt-[var(--space-12)]">
    <div class="flex flex-col gap-[var(--space-8)]">
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

    <section class="flex flex-col gap-[var(--space-4)]">
      <h2 class="t-heading">{{ t('experience.title') }}</h2>
      <div class="flex flex-col">
        <ListRow
          v-for="job in experience"
          :key="job.id"
          as="article"
          :tone="job.tone"
          :icon="job.icon"
          :title="t(`experience.items.${job.id}.role`)"
          :caption="t(`experience.items.${job.id}.company`)"
          :year="job.period"
          trailing-icon=""
        >
          <p class="t-small max-w-[62ch]">{{ t(`experience.items.${job.id}.summary`) }}</p>
        </ListRow>
      </div>
    </section>
  </div>
</template>
