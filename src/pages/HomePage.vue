<template>
  <div class="flex flex-col gap-[var(--space-20)] pt-[var(--space-12)]">
    <section class="flex flex-col gap-[var(--space-6)]">
      <h1 class="t-display max-w-[16ch]">{{ t('home.title') }}</h1>

      <div class="flex max-w-[52ch] flex-col gap-[var(--space-3)]">
        <p class="t-body text-muted-foreground">{{ t('home.lead') }}</p>
        <p class="t-tech">{{ t('home.tech') }}</p>
      </div>

      <div class="flex flex-wrap items-center gap-[var(--space-3)]">
        <Button as-child size="lg">
          <Link :to="routeLocation.projects()">
            {{ t('home.actions.work') }}
            <Icon name="arrow_forward" />
          </Link>
        </Button>
        <Button as-child variant="ghost" size="lg">
          <Link to="mailto:egokakill@gmail.com">
            <Icon name="mail" />
            {{ t('home.actions.write') }}
          </Link>
        </Button>
      </div>
    </section>

    <section class="flex flex-col gap-[var(--space-6)]">
      <header class="flex items-baseline gap-[var(--space-3)]">
        <h2 class="t-heading">{{ t('home.featured.title') }}</h2>
        <span class="t-hand text-[24px] text-clay">{{ t('home.featured.note') }}</span>
        <Link
          :to="routeLocation.projects()"
          class="t-action ms-auto inline-flex items-center gap-[4px] hover:underline"
        >
          {{ t('home.featured.all') }}
          <Icon name="arrow_outward" :size="16" />
        </Link>
      </header>

      <div class="grid gap-[var(--space-4)] sm:grid-cols-2">
        <Card
          v-for="project in featured"
          :key="project.slug"
          as="article"
          :tone="project.tone"
          :icon="project.icon"
          :title="project.title"
          :caption="t(project.captionKey)"
          :year="project.year"
        />
        <Card
          variant="empty"
          icon="add"
          :title="t('home.next.title')"
          :caption="t('home.next.caption')"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Link } from '@/components/ui/link'
import { routeLocation } from '@/router/route-locations'
import { projects } from '@/data/projects'

const { t } = useI18n()

const featured = projects.slice(0, 3)
</script>
