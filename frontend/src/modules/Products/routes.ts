import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/router/router.enums'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: '/products/create',
    name: RouteName.ProductCreate,
    component: () => import('./views/ProductCreateView.vue'),
  },
]
