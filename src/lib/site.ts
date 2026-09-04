const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')
const configured = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '')

export const SITE_URL =
  configured || (typeof window !== 'undefined' ? `${window.location.origin}${BASE}` : BASE)

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`

export const publicUrl = (path: string) => `${BASE}/${path.replace(/^\//, '')}`
