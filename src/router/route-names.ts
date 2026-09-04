export const ROUTE_NAMES = {
  HOME: 'home',
  PROJECTS: 'projects',
  CV: 'cv',
} as const

export type AppRouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
