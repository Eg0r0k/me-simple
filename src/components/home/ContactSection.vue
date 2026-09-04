<script setup lang="ts">
import { I18nT, useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { PenStroke } from '@/components/ui/pen-stroke'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import IconMail from '~icons/material-symbols/mail-rounded'
import type { ContactLink } from '@/data/contact'
import { externalLinkAttrs } from '@/lib/links'
import { reveal } from '@/lib/motion'
import CopyEmail from './CopyEmail.vue'
import SectionTitle from './SectionTitle.vue'

defineProps<{
  email: string
  mailto: string
  links: readonly ContactLink[]
}>()

const { t } = useI18n()
</script>

<template>
  <section v-motion v-bind="reveal()" class="flex flex-col gap-(--space-6)">
    <div class="flex flex-col gap-(--space-3)">
      <SectionTitle>{{ t('contact.title') }}</SectionTitle>
      <I18nT keypath="contact.lead" tag="p" scope="global" class="t-body text-muted-foreground">
        <template #day>
          <PenStroke>{{ t('contact.day') }}</PenStroke>
        </template>
      </I18nT>
    </div>

    <div class="flex flex-col gap-(--space-4)">
      <CopyEmail :email="email" />

      <div class="flex flex-wrap items-center gap-(--space-3)">
        <Button as="a" :href="mailto" size="lg">
          <IconMail aria-hidden="true" />
          {{ t('home.actions.write') }}
        </Button>

        <TooltipProvider>
          <Tooltip v-for="link in links" :key="link.id">
            <TooltipTrigger as-child>
              <Button
                as="a"
                v-bind="externalLinkAttrs(link.url)"
                variant="secondary"
                size="icon-lg"
                :aria-label="t(`contact.items.${link.id}`)"
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
</template>
