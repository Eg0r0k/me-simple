export const ROUTE_NAMES = {
  HOME: 'home',
  PROJECTS: 'projects',
} as const

export type AppRouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
