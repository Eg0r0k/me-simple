// Портировано из Audiogram (src/lib/environment/userAgent.ts).
// Исходно: https://github.com/morethanwords/tweb/blob/master/src/environment/userAgent.ts
// Всё, что касалось Tauri (isTauri, IS_TAURI, IS_APP), намеренно не перенесено.

const ctx = typeof window !== 'undefined' ? window : self

export const USER_AGENT = navigator.userAgent

export const IS_APPLE = navigator.userAgent.search(/OS X|iPhone|iPad|iOS/i) !== -1

export const IS_ANDROID = navigator.userAgent.toLowerCase().indexOf('android') !== -1

// Любой Chromium (Chrome, Edge, Opera, WebView2) несёт токен Chrome.
export const IS_CHROMIUM = /Chrome/.test(navigator.userAgent)

// https://stackoverflow.com/a/58065241 — без устаревшего navigator.platform:
// iPadOS в десктопном режиме шлёт Macintosh UA, отличает его поддержка тача.
export const IS_APPLE_MOBILE =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)) &&
  !(ctx as unknown as { MSStream?: unknown }).MSStream

export const IS_SAFARI =
  !!('safari' in ctx) ||
  !!(
    USER_AGENT &&
    (/\b(iPad|iPhone|iPod)\b/.test(USER_AGENT) ||
      (/Safari/.test(USER_AGENT) && !/Chrome/.test(USER_AGENT)))
  )

export const IS_FIREFOX = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

export const IS_MOBILE_SAFARI = IS_SAFARI && IS_APPLE_MOBILE

export const IS_MOBILE =
  navigator.maxTouchPoints > 0 &&
  navigator.userAgent.search(
    /iOS|iPhone OS|Android|BlackBerry|BB10|Series ?[64]0|J2ME|MIDP|opera mini|opera mobi|mobi.+Gecko|Windows Phone/i,
  ) !== -1

export const IS_WINDOWS = /Windows/.test(navigator.userAgent)

export const IS_PWA = window.matchMedia('(display-mode: standalone)').matches
