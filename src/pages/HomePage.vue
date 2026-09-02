<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Link } from '@/components/ui/link'
import { ListRow } from '@/components/ui/list-row'
import { routeLocation } from '@/router/route-locations'
import { MAILTO, links } from '@/data/contact'
import { experience } from '@/data/resume'
import { projects } from '@/data/projects'

const { t, locale } = useI18n()

const EASE: [number, number, number, number] = [0.2, 0, 0.2, 1]

const words = computed(() => t('home.name').split(' '))
const wordDelay = (index: number) => 0.12 + index * 0.07
const tail = () => 0.12 + words.value.length * 0.07

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
})

const reveal = () => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true },
  transition: { duration: 0.5, ease: EASE },
})
</script>

<template>
  <div class="flex flex-col gap-[var(--space-20)] pb-[var(--space-12)]">
    <section class="flex min-h-[calc(100svh-72px)] flex-col justify-center gap-[var(--space-6)]">
      <div v-motion v-bind="rise(0)" class="flex items-center gap-[8px]">
        <span
          class="size-[7px] shrink-0 rounded-full bg-mint [animation:ds-breathe_3.2s_ease-in-out_infinite] motion-reduce:animate-none"
        />
        <span class="t-label">{{ t('home.status') }}</span>
      </div>

      <div class="flex flex-col gap-[var(--space-2)]">
        <h1 :key="locale" class="t-display">
          <span
            v-for="(word, index) in words"
            :key="`${word}-${index}`"
            class="me-[0.24em] inline-block overflow-hidden pb-[0.14em] align-bottom [margin-bottom:-0.14em]"
          >
            <span
              v-motion
              class="inline-block"
              :initial="{ y: '115%' }"
              :animate="{ y: '0%' }"
              :transition="{ duration: 0.75, delay: wordDelay(index), ease: EASE }"
              >{{ word }}</span
            >
          </span>
        </h1>
        <p v-motion v-bind="rise(tail())" class="t-subheading text-muted-foreground">
          {{ t('home.role') }}
        </p>
      </div>

      <div class="flex max-w-[52ch] flex-col gap-[var(--space-2)]">
        <p v-motion v-bind="rise(tail() + 0.08)" class="t-body text-muted-foreground">
          {{ t('home.lead') }}
        </p>
        <p v-motion v-bind="rise(tail() + 0.14)" class="t-tech">{{ t('home.tech') }}</p>
      </div>

      <div
        v-motion
        v-bind="rise(tail() + 0.22)"
        class="flex flex-wrap items-center gap-[var(--space-3)]"
      >
        <Button as-child size="lg">
          <Link :to="routeLocation.projects()">
            {{ t('home.actions.work') }}
            <Icon name="arrow_forward" />
          </Link>
        </Button>
        <Button as-child variant="ghost" size="lg">
          <Link :to="MAILTO">
            <Icon name="mail" />
            {{ t('home.actions.write') }}
          </Link>
        </Button>
      </div>
    </section>

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-4)]">
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

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-4)]">
      <header class="flex items-baseline gap-[var(--space-3)]">
        <h2 class="t-heading">{{ t('projects.title') }}</h2>
        <span class="t-hand text-[24px] text-clay">soon more!</span>
        <Link
          :to="routeLocation.projects()"
          class="t-action ms-auto inline-flex items-center gap-[4px] hover:underline"
        >
          {{ t('projects.all') }}
          <Icon name="arrow_outward" :size="16" />
        </Link>
      </header>

      <div class="grid gap-[var(--space-4)] sm:grid-cols-2">
        <Card
          v-for="project in projects"
          :key="project.slug"
          :as="project.url ? 'a' : 'article'"
          :href="project.url"
          :target="project.url ? '_blank' : undefined"
          :rel="project.url ? 'noopener noreferrer' : undefined"
          :tone="project.tone"
          :icon="project.icon"
          :title="project.title"
          :caption="t(project.captionKey)"
          :year="project.year"
        />
      </div>
    </section>

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-4)]">
      <h2 class="t-heading">{{ t('contact.title') }}</h2>
      <p class="t-small max-w-[52ch]">{{ t('contact.lead') }}</p>
      <div class="flex flex-col">
        <ListRow
          v-for="link in links"
          :key="link.id"
          as="a"
          :href="link.url"
          :target="link.id === 'email' ? undefined : '_blank'"
          :rel="link.id === 'email' ? undefined : 'noopener noreferrer'"
          tone="peri"
          :icon="link.icon"
          :title="t(`contact.items.${link.id}`)"
          :caption="link.handle"
        />
      </div>
      <div class="flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-1)]">
        <span class="t-label">{{ t('home.meta.location') }}</span>
        <span class="t-label">{{ t('home.meta.remote') }}</span>
      </div>
    </section>
  </div>
</template>
