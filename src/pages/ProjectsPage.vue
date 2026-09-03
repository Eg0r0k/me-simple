<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { ProjectShot, toPreviewLocale } from '@/components/project-list'
import IconArrowBack from '~icons/material-symbols/arrow-back-rounded'
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import { projects } from '@/data/projects'
import { routeLocation } from '@/router/route-locations'

const { t, locale } = useI18n()

const counter = computed(() => t('projects.count', projects.length))
const previewLocale = computed(() => toPreviewLocale(locale.value))
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-[var(--column)] flex-col gap-[var(--space-8)] px-[var(--space-6)] pt-[var(--space-12)] pb-[var(--space-20)]"
  >
    <Button
      :as="RouterLink"
      :to="routeLocation.home()"
      variant="ghost"
      size="sm"
      class="self-start -ms-[9px]"
    >
      <IconArrowBack aria-hidden="true" />
      {{ t('projects.back') }}
    </Button>

    <header class="flex flex-col gap-[var(--space-3)]">
      <span class="t-label">{{ counter }} · {{ t('projects.range') }}</span>
      <h1 class="t-title m-0">{{ t('projects.title') }}</h1>
    </header>

    <div class="grid grid-cols-1 gap-[var(--space-4)] sm:grid-cols-2">
      <component
        :is="project.url ? 'a' : 'article'"
        v-for="project in projects"
        :key="project.slug"
        :href="project.url"
        :target="project.url ? '_blank' : undefined"
        :rel="project.url ? 'noopener noreferrer' : undefined"
        class="group press-scale flex flex-col gap-[var(--space-3)] rounded-card p-[var(--space-3)] no-underline text-fg [transition:background-color_var(--dur-surface)_ease,transform_var(--dur-press)_var(--ease-standard)] hover:bg-sunk"
      >
        <div class="overflow-hidden rounded-3">
          <ProjectShot
            :project="project"
            :locale="previewLocale"
            class="[transition:transform_300ms_var(--ease-standard)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>

        <div class="flex flex-col gap-1 px-1">
          <div class="flex items-center gap-2">
            <span class="truncate text-[15.5px] font-semibold tracking-[-0.012em]">{{
              project.title
            }}</span>
            <span class="ms-auto t-label">{{ project.year }}</span>
            <IconArrowOutward
              v-if="project.url"
              class="size-5 shrink-0 text-faint [transition:transform_var(--dur-hover)_var(--ease-standard)] group-hover:translate-x-[2px] group-hover:-translate-y-[2px] motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
              aria-hidden="true"
            />
          </div>
          <p class="t-small m-0">{{ t(project.captionKey) }}</p>
        </div>
      </component>
    </div>
  </div>
</template>
