import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNavigatorLanguage, useStorage } from '@vueuse/core'
import {
  LANGUAGE_NATIVE_MAP,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@/app/i18n/languages'
import { DEFAULT_LOCALE, isSupportedLocale, setHtmlLangAttribute } from '@/app/i18n/utils'

/**
 * Языковая часть useGeneralSettings из Audiogram, вынесенная отдельно:
 * здесь нет модуля настроек, поэтому выбор хранится в localStorage напрямую.
 * `system` следит за языком браузера в реальном времени.
 */

const language = useStorage<SupportedLanguage>(LANGUAGE_STORAGE_KEY, 'system')

export const useLocale = () => {
  const { locale, t } = useI18n()
  const { language: browserLanguage } = useNavigatorLanguage()

  const systemLanguage = computed<SupportedLanguage>(() => {
    const browserLang = browserLanguage.value?.split('-')[0]
    if (browserLang && isSupportedLocale(browserLang)) {
      return browserLang
    }
    return DEFAULT_LOCALE
  })

  const activeLanguage = computed<SupportedLanguage>(() => {
    if (language.value === 'system') {
      return systemLanguage.value
    }
    return language.value
  })

  const activeLanguageNative = computed(
    () => LANGUAGE_NATIVE_MAP[activeLanguage.value] || activeLanguage.value,
  )

  const applyLanguage = (lang: SupportedLanguage) => {
    const effectiveLang = lang === 'system' ? systemLanguage.value : lang
    locale.value = effectiveLang
    setHtmlLangAttribute(effectiveLang)
    document.title = t('common.appTitle')
  }

  const setLanguage = (lang: SupportedLanguage) => {
    language.value = lang
    applyLanguage(lang)
  }

  const init = () => {
    applyLanguage(language.value)

    watch(browserLanguage, () => {
      if (language.value === 'system') {
        applyLanguage('system')
      }
    })
  }

  return {
    language,
    activeLanguage,
    activeLanguageNative,
    systemLanguage,
    languages: LANGUAGE_OPTIONS,
    supportedLanguages: SUPPORTED_LANGUAGES,
    setLanguage,
    init,
  }
}
