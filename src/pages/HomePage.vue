<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import HomeIntro from '@/components/home/HomeIntro.vue'
import ProjectsSection from '@/components/home/ProjectsSection.vue'
import ExperienceSection from '@/components/home/ExperienceSection.vue'
import AwardsSection from '@/components/home/AwardsSection.vue'
import ContactSection from '@/components/home/ContactSection.vue'
import LighthouseSection from '@/components/home/LighthouseSection.vue'
import { useSeo } from '@/composables/useSeo'
import { EMAIL, MAILTO, links } from '@/data/contact'
import { experience } from '@/data/resume'
import { projects } from '@/data/projects'
import { stack } from '@/data/stack'
import { awards } from '@/data/awards'
import { LIGHTHOUSE_DATE, lighthouse } from '@/data/lighthouse'
import { absoluteUrl } from '@/lib/site'

const { t } = useI18n()

const socials = links.filter((link) => link.id !== 'email')

useSeo({
  title: () => t('common.appTitle'),
  description: () => t('home.seo.description'),
})

const personSchema = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: t('home.name'),
    jobTitle: t('home.role'),
    url: absoluteUrl('/'),
    email: MAILTO,
    sameAs: socials.map((link) => link.url),
  }),
)

useHead({
  script: [{ type: 'application/ld+json', innerHTML: personSchema }],
})
</script>

<template>
  <div
    class="mx-auto flex w-full max-w-(--column) flex-col gap-(--space-20) px-(--space-6) pt-(--space-12) pb-(--space-20)"
  >
    <HomeIntro :stack="stack" :email="EMAIL" :mailto="MAILTO" />
    <LighthouseSection :scores="lighthouse" :date="LIGHTHOUSE_DATE" />
    <ProjectsSection :projects="projects" />
    <ExperienceSection :jobs="experience" />
    <AwardsSection :awards="awards" />
    <ContactSection :email="EMAIL" :mailto="MAILTO" :links="socials" />
  </div>
</template>
