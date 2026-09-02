import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/router/route-names'

export const pageRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/projects',
    name: ROUTE_NAMES.PROJECTS,
    component: () => import('@/pages/ProjectPage.vue'),
  },
  {
    path: '/about',
    name: ROUTE_NAMES.ABOUT,
    component: () => import('@/pages/AboutPage.vue'),
  },
]
