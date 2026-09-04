import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead, useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { absoluteUrl } from '@/lib/site'

const OG_LOCALES: Record<string, string> = { en: 'en_US', ru: 'ru_RU' }

export interface SeoInput {
  title: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
}

export function useSeo(input: SeoInput) {
  const route = useRoute()
  const { t, locale } = useI18n()

  const url = computed(() => absoluteUrl(route.path))
  const title = computed(() => toValue(input.title))
  const description = computed(() => toValue(input.description))

  useHead({
    link: [{ rel: 'canonical', href: url }],
  })

  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogUrl: url,
    ogType: 'website',
    ogSiteName: () => t('home.name'),
    ogLocale: () => OG_LOCALES[locale.value] ?? 'en_US',
    twitterCard: 'summary',
  })
}
