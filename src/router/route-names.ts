export const ROUTE_NAMES = {
  HOME: 'home',
} as const

export type AppRouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
