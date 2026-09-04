<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ProjectCard, toPreviewLocale } from '@/components/project-list'
import IconArrowBack from '~icons/material-symbols/arrow-back-rounded'
import { useSeo } from '@/composables/useSeo'
import { projects } from '@/data/projects'
import { routeLocation } from '@/router/route-locations'
import { rise } from '@/lib/motion'

const { t, locale } = useI18n()

useSeo({
  title: () => `${t('projects.title')} — ${t('home.name')}`,
  description: () => t('projects.seo.description'),
})

// Задержки задаём числами: computed в delay ломает старт анимации молча.
const DELAY_HEADER = 0.06
const DELAY_CARDS = 0.12
const STAGGER = 0.05

const counter = computed(() => t('projects.count', projects.length))
const previewLocale = computed(() => toPreviewLocale(locale.value))
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-(--column) flex-col gap-(--space-8) px-(--space-6) pt-(--space-12) pb-(--space-20)"
  >
    <Button
      v-motion
      v-bind="rise(0)"
      :as="RouterLink"
      :to="routeLocation.home()"
      variant="ghost"
      size="sm"
      class="self-start -ms-2.25"
    >
      <IconArrowBack aria-hidden="true" />
      {{ t('projects.back') }}
    </Button>

    <header v-motion v-bind="rise(DELAY_HEADER)" class="flex flex-col gap-(--space-3)">
      <span class="t-label">{{ counter }} &nbsp; {{ t('projects.range') }}</span>
      <h1 class="t-title m-0">{{ t('projects.title') }}</h1>
    </header>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <ProjectCard
        v-for="(project, index) in projects"
        :key="project.slug"
        :project="project"
        :locale="previewLocale"
        :delay="DELAY_CARDS + index * STAGGER"
      />
    </div>
  </div>
</template>
