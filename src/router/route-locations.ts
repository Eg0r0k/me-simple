import type { RouteLocationRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/router/route-names'

export const routeLocation = {
  home: (): RouteLocationRaw => ({ name: ROUTE_NAMES.HOME }),
} as const
