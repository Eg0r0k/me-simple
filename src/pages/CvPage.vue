<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconArrowOutward from '~icons/material-symbols/arrow-outward-rounded'
import AwardRow from '@/components/home/AwardRow.vue'
import CvHeader from '@/components/cv/CvHeader.vue'
import CvJob from '@/components/cv/CvJob.vue'
import CvSection from '@/components/cv/CvSection.vue'
import { ListRow } from '@/components/ui/list-row'
import { useSeo } from '@/composables/useSeo'
import { awards } from '@/data/awards'
import { EMAIL, links } from '@/data/contact'
import { cvSkills } from '@/data/cv'
import { projects } from '@/data/projects'
import { experience } from '@/data/resume'
import { externalLinkAttrs } from '@/lib/links'

const { t, tm, rt } = useI18n()

const socials = links.filter((link) => link.id !== 'email')

const list = (key: string) => (tm(key) as unknown[]).map((item) => rt(item as string))

useSeo({
  title: () => `${t('cv.title')} — ${t('home.name')}`,
  description: () => t('cv.summary'),
})
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-(--column) flex-col gap-(--space-8) px-(--space-6) pt-(--space-12) pb-(--space-20) print:max-w-none print:gap-6 print:p-0"
  >
    <CvHeader
      :name="t('home.name')"
      :role="t('home.role')"
      :location="t('cv.location')"
      :email="EMAIL"
      :links="socials"
    />

    <CvSection :title="t('cv.sections.summary')">
      <p class="t-body m-0 text-muted-foreground">{{ t('cv.summary') }}</p>
    </CvSection>

    <CvSection :title="t('cv.sections.experience')">
      <div class="flex flex-col">
        <CvJob
          v-for="job in experience"
          :key="job.id"
          :role="t(`cv.jobs.${job.id}.role`)"
          :company="t(`cv.jobs.${job.id}.company`)"
          :period="t(`cv.jobs.${job.id}.period`)"
          :bullets="list(`cv.jobs.${job.id}.bullets`)"
          :url="job.url"
        />
      </div>
    </CvSection>

    <CvSection :title="t('cv.sections.projects')">
      <div class="flex flex-col">
        <ListRow
          v-for="project in projects"
          :key="project.slug"
          :as="project.url ? 'a' : 'article'"
          v-bind="externalLinkAttrs(project.url)"
          :title="project.title"
          :caption="t(project.captionKey)"
          :year="project.year"
          :trailing-icon="project.url ? IconArrowOutward : null"
          class="break-inside-avoid"
        />
      </div>
    </CvSection>

    <CvSection :title="t('cv.sections.skills')">
      <dl class="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
        <template v-for="group in cvSkills" :key="group.id">
          <dt class="t-label">{{ t(`cv.skills.${group.id}`) }}</dt>
          <dd class="t-small m-0 text-fg">{{ group.items.join(', ') }}</dd>
        </template>
      </dl>
    </CvSection>

    <CvSection :title="t('cv.sections.awards')">
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
    </CvSection>

    <div
      class="grid gap-(--space-8) sm:grid-cols-[112px_1fr_1fr] sm:gap-6 print:grid-cols-[104px_1fr_1fr] print:gap-6"
    >
      <span class="hidden sm:block print:block" aria-hidden="true" />
      <CvSection :title="t('cv.sections.education')" stacked>
        <p class="m-0 flex min-w-0 flex-col gap-0.5">
          <span class="text-[15.5px] font-semibold tracking-[-0.012em] text-fg">{{
            t('cv.education.school')
          }}</span>
          <span class="t-small">{{ t('cv.education.field') }}</span>
          <span class="t-label">{{ t('cv.education.degree') }}</span>
        </p>
      </CvSection>

      <CvSection :title="t('cv.sections.languages')" stacked>
        <ul class="m-0 flex list-none flex-col gap-0.5 p-0">
          <li
            v-for="(language, index) in list('cv.languages')"
            :key="index"
            class="t-small text-fg"
          >
            {{ language }}
          </li>
        </ul>
      </CvSection>
    </div>
  </div>
</template>
