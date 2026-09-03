import { createRouter, createWebHistory } from 'vue-router'
import { pageRoutes } from './routes/pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...pageRoutes],
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
})

export default router
