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

export const LANGUAGE_STORAGE_KEY = 'language'
