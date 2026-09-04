<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { I18nT, useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ListRow } from '@/components/ui/list-row'
import { PenStroke } from '@/components/ui/pen-stroke'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ProjectList } from '@/components/project-list'
import IconMail from '~icons/material-symbols/mail-rounded'
import IconArrowForward from '~icons/material-symbols/arrow-forward-rounded'
import { EMAIL, MAILTO, links } from '@/data/contact'
import { experience } from '@/data/resume'
import { projects } from '@/data/projects'
import { routeLocation } from '@/router/route-locations'
import IconCheck from '~icons/material-symbols/verified-rounded'
import TechChip from '@/components/home/TechChip.vue'
import HoverNote from '@/components/home/HoverNote.vue'
import AwardRow from '@/components/home/AwardRow.vue'
import CopyEmail from '@/components/home/CopyEmail.vue'
import CountUp from '@/components/home/CountUp.vue'
import { useMoscowTime } from '@/composables/useMoscowTime'
import { stack } from '@/data/stack'
import { awards } from '@/data/awards'
const { t } = useI18n()
const { time } = useMoscowTime()

const EASE: [number, number, number, number] = [0.2, 0, 0.2, 1]

const DELAY_FACE = 0
const DELAY_LEAD = 0.08
const DELAY_TECH = 0.14
const DELAY_MORE = 0.2

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

// Линия под стеком включается на следующий кадр после монтажа.
const techLineOn = ref(false)
onMounted(() => {
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      techLineOn.value = true
    })
  } else {
    techLineOn.value = true
  }
})
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
          <p
            class="m-0 flex flex-wrap items-center gap-x-[10px] gap-y-[2px] text-[16px] text-muted-foreground"
          >
            {{ t('home.role') }}
            <span class="inline-flex items-center gap-[2px]">
              <TechChip
                v-for="item in stack"
                :key="item.id"
                :label="item.label"
                :url="item.url"
                :icon="item.icon"
              />
            </span>
          </p>
        </span>
      </div>
      <div class="flex max-w-[52ch] flex-col gap-[var(--space-3)]">
        <I18nT
          v-motion
          v-bind="rise(DELAY_LEAD)"
          keypath="home.lead"
          tag="p"
          scope="global"
          class="t-body text-muted-foreground"
        >
          <template #years><CountUp :to="Number(t('home.years'))" /></template>
          <template #stack>
            <span class="tech-line" :class="{ 'is-on': techLineOn }">{{ t('home.stack') }}</span>
          </template>
        </I18nT>
        <I18nT
          v-motion
          v-bind="rise(DELAY_TECH)"
          keypath="home.tech"
          tag="p"
          scope="global"
          class="t-body text-muted-foreground"
        >
          <template #city>
            <HoverNote :title="time" :text="t('home.notes.city')">{{ t('home.city') }}</HoverNote>
          </template>
          <template #remote>
            <HoverNote :title="t('home.notes.remote.title')" :text="t('home.notes.remote.text')">{{
              t('home.remote')
            }}</HoverNote>
          </template>
          <template #open>
            <HoverNote
              :href="MAILTO"
              :title="t('home.notes.open.title')"
              :text="`${EMAIL}, ${t('home.notes.open.text')}`"
              dot
              >{{ t('home.open') }}</HoverNote
            >
          </template>
        </I18nT>
        <p v-motion v-bind="rise(DELAY_MORE)" class="t-body text-muted-foreground">
          {{ t('home.more') }}
        </p>
      </div>
    </section>

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-4)]">
      <RouterLink
        :to="routeLocation.projects()"
        class="press-scale group -mx-[12px] flex min-h-[44px] items-center justify-between rounded-3 px-[12px] no-underline"
        data-cuelume-hover="whisper"
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
          data-cuelume-hover="whisper"
        >
          <p class="t-small">{{ t(`experience.items.${job.id}.summary`) }}</p>
        </ListRow>
      </div>
    </section>

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-4)]">
      <h2 class="m-0 text-[13.5px] font-semibold text-muted-foreground">
        {{ t('awards.title') }}
      </h2>

      <ul class="m-0 flex list-none flex-col p-0">
        <li v-for="award in awards" :key="award.id">
          <AwardRow
            :year="award.year"
            :title="t(`awards.items.${award.id}.title`)"
            :subtitle="t(`awards.items.${award.id}.subtitle`)"
            :url="award.url"
          />
        </li>
      </ul>
    </section>

    <section v-motion v-bind="reveal()" class="flex flex-col gap-[var(--space-6)]">
      <div class="flex max-w-[52ch] flex-col gap-[var(--space-3)]">
        <h2 class="m-0 text-[13.5px] font-semibold text-muted-foreground">
          {{ t('contact.title') }}
        </h2>
        <I18nT keypath="contact.lead" tag="p" scope="global" class="t-body text-muted-foreground">
          <template #day>
            <PenStroke>{{ t('contact.day') }}</PenStroke>
          </template>
        </I18nT>
      </div>

      <div class="flex flex-col gap-[var(--space-4)]">
        <CopyEmail :email="EMAIL" data-cuelume-hover="whisper" />

        <div class="flex flex-wrap items-center gap-[var(--space-3)]">
          <Button as="a" :href="MAILTO" size="lg" data-cuelume-hover="whisper">
            <IconMail aria-hidden="true" />
            {{ t('home.actions.write') }}
          </Button>

          <TooltipProvider>
            <Tooltip v-for="link in socials" :key="link.id">
              <TooltipTrigger as-child>
                <Button
                  as="a"
                  :href="link.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="icon-lg"
                  :aria-label="t(`contact.items.${link.id}`)"
                  data-cuelume-hover="whisper"
                >
                  <component :is="link.icon" aria-hidden="true" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{{ link.handle }}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </section>
  </div>
</template>
