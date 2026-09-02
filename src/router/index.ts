import { createRouter, createWebHistory } from 'vue-router'
import { pageRoutes } from './routes/pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...pageRoutes],
})

export default router
