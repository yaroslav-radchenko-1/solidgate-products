import { createRouter, createWebHistory } from 'vue-router'
import { homeRoutes } from '@/modules/Home/routes'
import { productRoutes } from '@/modules/Products/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...homeRoutes, ...productRoutes],
})

export default router
