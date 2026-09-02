<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Link } from '@/components/ui/link'
import { routeLocation } from '@/router/route-locations'
import { EMAIL, MAILTO } from '@/data/contact'

const { t, locale } = useI18n()

const EASE: [number, number, number, number] = [0.2, 0, 0.2, 1]

const words = computed(() => t('home.title').split(' '))
const wordDelay = (index: number) => 0.14 + index * 0.055
const tail = computed(() => 0.14 + words.value.length * 0.055)

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: EASE },
})
</script>

<template>
  <section
    class="flex min-h-[calc(100dvh-72px)] flex-col justify-center gap-[var(--space-8)] pb-[var(--space-12)]"
  >
    <div v-motion v-bind="rise(0)" class="flex items-center gap-[8px]">
      <span
        class="size-[7px] shrink-0 rounded-full bg-mint [animation:ds-breathe_3.2s_ease-in-out_infinite] motion-reduce:animate-none"
      />
      <span class="t-label">{{ t('home.status') }}</span>
    </div>

    <h1 :key="locale" class="t-display max-w-[15ch]">
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

    <div class="flex max-w-[52ch] flex-col gap-[var(--space-3)]">
      <p v-motion v-bind="rise(tail)" class="t-body text-muted-foreground">{{ t('home.lead') }}</p>
      <p v-motion v-bind="rise(tail + 0.08)" class="t-tech">{{ t('home.tech') }}</p>
    </div>

    <div
      v-motion
      v-bind="rise(tail + 0.16)"
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

    <div
      v-motion
      v-bind="rise(tail + 0.26)"
      class="mt-[var(--space-8)] flex flex-wrap items-center gap-x-[var(--space-4)] gap-y-[var(--space-1)]"
    >
      <span class="t-label">{{ t('home.meta.location') }}</span>
      <span class="t-label">{{ t('home.availability') }}</span>
      <Link :to="MAILTO" class="t-action inline-flex items-center gap-[4px] hover:underline">
        {{ EMAIL }}
        <Icon name="arrow_outward" :size="15" />
      </Link>
    </div>
  </section>
</template>
