/**
 * Аналог SUPPORTED_LANGUAGES из Audiogram (там он живёт в схеме настроек).
 * `system` означает «взять язык браузера».
 */
export const SUPPORTED_LANGUAGES = ['system', 'en', 'ru'] as const
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export interface LanguageOption {
  code: SupportedLanguage
  name: string
  native: string
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'system', name: 'System', native: 'System' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
]

export const LANGUAGE_NATIVE_MAP: Record<string, string> = {
  en: 'English',
  ru: 'Русский',
}

/** Ключ в localStorage, в котором лежит выбор пользователя. */
export const LANGUAGE_STORAGE_KEY = 'language'
