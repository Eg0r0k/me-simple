import {
  IS_ANDROID,
  IS_APPLE,
  IS_APPLE_MOBILE,
  IS_FIREFOX,
  IS_MOBILE,
  IS_SAFARI,
} from '@/lib/environment/userAgent'

/**
 * Портировано из Audiogram (src/composables/useSetupRootClasses.ts).
 * Ветка is-tauri не перенесена, классы скролла тоже: в этом проекте
 * своя реализация скроллбара.
 *
 * Класс `is-mobile` включает мобильную ветку `.press-scale` из §2.
 */
export const useSetupRootClasses = () => {
  const add: string[] = []

  if (IS_FIREFOX) {
    add.push('is-firefox')
  }
  if (IS_MOBILE) {
    add.push('is-mobile')
  }
  if (IS_APPLE) {
    if (IS_SAFARI) {
      add.push('is-safari')
    }
    if (IS_APPLE_MOBILE) {
      add.push('is-ios')
    } else {
      add.push('is-mac')
    }
  } else if (IS_ANDROID) {
    add.push('is-android')
  }

  document.documentElement.classList.add(...add)
}
