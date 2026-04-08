# Router Conventions

## Structure

```
src/router/
├── index.ts              # Router instance + global guards
├── router.enums.ts       # Route name enums
└── router.consts.ts      # Route path constants (if needed)

src/modules/ModuleName/
└── routes.ts             # Module route definitions
```

---

## Route Names — Enum

Route names are defined as enums following project naming conventions:

```ts
// src/router/router.enums.ts
export enum RouteName {
  Home = 'home',
  UserProfile = 'userProfile',
  UserProfileEdit = 'userProfileEdit',
  Login = 'login',
}
```

---

## Module routes.ts

```ts
// src/modules/UserProfile/routes.ts
import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@/router/router.enums'

export const userProfileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile/:id',
    name: RouteName.UserProfile,
    component: () => import('./views/ProfileView.vue'),
  },
  {
    path: '/profile/:id/edit',
    name: RouteName.UserProfileEdit,
    component: () => import('./views/ProfileEditView.vue'),
  },
]
```

---

## Central Router

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { userProfileRoutes } from '@/modules/UserProfile/routes'
import { authRoutes } from '@/modules/Auth/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    ...userProfileRoutes,
    { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('@/ui/NotFound.vue') },
  ],
})

export default router
```

---

## Rules

- **Always lazy load** view components — never static imports for routes
- **Always use enum** for route names — never raw strings
- **One routes.ts per module** — keep route definitions close to the feature
- Navigation guards live in `src/modules/ModuleName/guards/` and are registered in `src/router/index.ts`