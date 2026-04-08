import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/router/router.enums'

export const homeRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.Home,
    component: () => import('./views/HomeView.vue'),
  },
]
