import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from '@/router/route-names'

export const pageRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    // Страница одна: любой старый адрес возвращает на неё, а не в пустой экран.
    // Редирект по пути, а не по имени, — иначе роутер ругается на лишний `pathMatch`.
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
