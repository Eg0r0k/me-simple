<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import IconPrint from '~icons/material-symbols/print-rounded'
import IconCheck from '~icons/material-symbols/verified-rounded'
import IconMail from '~icons/material-symbols/mail-rounded'
import IconPin from '~icons/material-symbols/location-on-rounded'
import IconGlobe from '~icons/material-symbols/language'
import type { ContactLink } from '@/data/contact'
import { useSound } from '@/composables/useSound'
import { externalLinkAttrs } from '@/lib/links'
import { publicUrl, SITE_URL } from '@/lib/site'

defineProps<{
  name: string
  role: string
  location: string
  email: string
  links: readonly ContactLink[]
}>()

const { t } = useI18n()
const { cue } = useSound()

const siteLabel = computed(() => SITE_URL.replace(/^https?:\/\//, ''))

const print = () => {
  cue('tick')
  window.print()
}
</script>

<template>
  <header class="flex flex-col gap-(--space-4)">
    <div class="flex items-center gap-(--space-4)">
      <span
        class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface"
      >
        <img
          :src="publicUrl('face.svg')"
          alt=""
          width="118"
          height="150"
          class="h-13 w-auto select-none"
          draggable="false"
        />
      </span>
      <div class="flex min-w-0 flex-1 flex-col gap-0.5">
        <h1 class="t-title m-0 flex items-center gap-2">
          {{ name }}
          <IconCheck class="size-6 shrink-0 text-primary" aria-hidden="true" />
        </h1>
        <p class="t-body m-0 text-muted-foreground">{{ role }}</p>
      </div>
      <Button variant="secondary" size="sm" class="shrink-0 print:hidden" @click="print">
        <IconPrint aria-hidden="true" />
        {{ t('cv.print') }}
      </Button>
    </div>

    <ul
      class="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-1.5 p-0 t-code text-[13px] text-muted-foreground"
    >
      <li class="flex items-center gap-1.5">
        <IconPin class="size-4 text-faint" aria-hidden="true" />
        {{ location }}
      </li>
      <li>
        <a :href="`mailto:${email}`" class="flex items-center gap-1.5 no-underline hover:text-fg">
          <IconMail class="size-4 text-faint" aria-hidden="true" />
          {{ email }}
        </a>
      </li>
      <li v-for="link in links" :key="link.id">
        <a
          v-bind="externalLinkAttrs(link.url)"
          class="flex items-center gap-1.5 no-underline hover:text-fg"
        >
          <component :is="link.icon" class="size-4 text-faint" aria-hidden="true" />
          {{ link.handle }}
        </a>
      </li>
      <li class="hidden items-center gap-1.5 print:flex">
        <IconGlobe class="size-4 text-faint" aria-hidden="true" />
        {{ siteLabel }}
      </li>
    </ul>
  </header>
</template>
