<script setup lang="ts">
import { I18nT, useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ListRow } from '@/components/ui/list-row'
import { Marker } from '@/components/ui/marker'
import { ProjectList } from '@/components/project-list'
import IconMail from '~icons/material-symbols/mail-rounded'
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import IconArrowForward from '~icons/material-symbols/arrow-forward-rounded'
import { MAILTO, links } from '@/data/contact'
import { experience } from '@/data/resume'
import { projects } from '@/data/projects'
import { routeLocation } from '@/router/route-locations'
import IconCheck from '~icons/material-symbols/verified'
const { t } = useI18n()

const EASE: [number, number, number, number] = [0.2, 0, 0.2, 1]

const DELAY_FACE = 0
const DELAY_LEAD = 0.08
const DELAY_TECH = 0.14

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: EASE },
})

const reveal = () => ({
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  inViewOptions: { once: true },
  transition: { duration: 0.5, ease: EASE },
})

const socials = links.filter((link) => link.id !== 'email')
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-[var(--column)] flex-col gap-[var(--space-20)] px-[var(--space-6)] pt-[var(--space-12)] pb-[var(--space-20)]"
  >
    <section class="flex flex-col gap-[var(--space-6)]">
      <div v-motion v-bind="rise(DELAY_FACE)" class="flex items-center gap-[var(--space-3)]">
        <span
          class="flex items-center justify-center size-15 shrink-0 overflow-hidden rounded-full bg-surface"
        >
          <img
            src="/face.svg"
            alt=""
            width="118"
            height="150"
            class="h-12 w-auto select-none"
            draggable="false"
          />
        </span>

        <span class="flex min-w-0 flex-col leading-[1.45]">
          <h1 class="m-0 text-[16px] font-semibold tracking-[-0.012em] text-fg">
            {{ t('home.name') }}
            <IconCheck class="inline text-primary size-4 ml-1" />
          </h1>
          <p class="m-0 text-[16px] text-muted-foreground">{{ t('home.role') }}</p>
        </span>
      </div>
      <div class="flex max-w-[52ch] flex-col gap-[var(--space-3)]">
        <p v-motion v-bind="rise(DELAY_LEAD)" class="t-body text-muted-foreground">
          {{ t('home.lead') }}
        </p>
        <p v-motion v-bind="rise(DELAY_TECH)" class="t-body text-muted-foreground">
          {{ t('home.tech') }}
        </p>
      </div>
    </section>

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-4)]">
      <RouterLink
        :to="routeLocation.projects()"
        class="press-scale group -mx-[12px] flex min-h-[44px] items-center justify-between rounded-3 px-[12px] no-underline"
      >
        <h2
          class="m-0 flex items-center gap-1 text-[13.5px] font-semibold text-muted-foreground [transition:color_var(--dur-hover)_ease] group-hover:text-fg"
        >
          {{ t('projects.title') }}
          <IconArrowForward
            class="size-4 text-faint [transition:color_var(--dur-hover)_ease] group-hover:text-fg"
            aria-hidden="true"
          />
        </h2>
        <span class="t-label">{{ t('projects.count', projects.length) }}</span>
      </RouterLink>

      <ProjectList :projects="projects" />
    </section>

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-4)]">
      <h2 class="m-0 text-[13.5px] font-semibold text-muted-foreground">
        {{ t('experience.title') }}
      </h2>

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
          :trailing-icon="null"
        >
          <p class="t-small">{{ t(`experience.items.${job.id}.summary`) }}</p>
        </ListRow>
      </div>
    </section>

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-6)]">
      <div class="flex max-w-[52ch] flex-col gap-[var(--space-3)]">
        <h2 class="m-0 text-[13.5px] font-semibold text-muted-foreground">
          {{ t('contact.title') }}
        </h2>
        <I18nT keypath="contact.lead" tag="p" scope="global" class="t-body text-muted-foreground">
          <template #day>
            <Marker>{{ t('contact.day') }}</Marker>
          </template>
        </I18nT>
      </div>

      <div class="flex flex-wrap items-center gap-x-[var(--space-6)] gap-y-[var(--space-2)]">
        <Button as="a" :href="MAILTO" size="md">
          <IconMail aria-hidden="true" />
          {{ t('home.actions.write') }}
        </Button>

        <Button
          v-for="link in socials"
          as="a"
          :key="link.id"
          variant="link"
          :href="link.url"
          size="md"
        >
          <component :is="link.icon" class="size-[18px] shrink-0" aria-hidden="true" />
          {{ t(`contact.items.${link.id}`) }}
          <IconArrowOutward class="size-[15px] shrink-0 text-faint" aria-hidden="true" />
        </Button>
      </div>
    </section>
  </div>
</template>
