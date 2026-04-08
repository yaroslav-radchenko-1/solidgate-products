# Vue 3 Best Practices

## Performance

### Use v-show vs v-if correctly
```vue
<!-- v-show: element stays in DOM, toggles display -->
<!-- Use for: frequent toggling, expensive render to mount -->
<ExpensiveComponent v-show="isVisible" />

<!-- v-if: element removed/added from DOM -->
<!-- Use for: conditional rendering, lazy mounting -->
<UserProfile v-if="user" :user="user" />
```

### Lazy load routes
```ts
const routes = [
  {
    path: '/profile',
    component: () => import('@/modules/UserProfile/views/ProfileView.vue'),
  },
]
```

### Use computed for derived state
```ts
// ✅ Cached, only recomputes when deps change
const fullName = computed(() => `${user.value.firstName} ${user.value.lastName}`)

// ❌ Re-runs on every render
const getFullName = () => `${user.value.firstName} ${user.value.lastName}`
```

---

## Patterns

### Provide/Inject for deep prop passing
```ts
// Parent
provide('theme', readonly(theme))

// Deep child
const theme = inject<Theme>('theme')
```

### Async component with suspense
```vue
<Suspense>
  <template #default>
    <AsyncComponent />
  </template>
  <template #fallback>
    <LoadingSpinner />
  </template>
</Suspense>
```

### Dynamic components over v-if chains
```vue
<!-- ❌ Long v-if chain -->
<ComponentA v-if="type === 'a'" />
<ComponentB v-else-if="type === 'b'" />
<ComponentC v-else-if="type === 'c'" />

<!-- ✅ Dynamic component -->
<component :is="componentMap[type]" />
```

```ts
const componentMap = {
  a: ComponentA,
  b: ComponentB,
  c: ComponentC,
}
```

---

## Common Mistakes

### Never mutate props
```ts
// ❌ Direct prop mutation
props.user.name = 'New Name'

// ✅ Emit event for parent to handle
emit('update:user', { ...props.user, name: 'New Name' })
```

### Clean up side effects
```ts
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

// ✅ Always clean up
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

### Use watchEffect for sync side effects
```ts
// ✅ Auto-tracks dependencies
watchEffect(() => {
  document.title = `${route.name} | App`
})

// Use watch when you need oldValue or explicit deps
watch(userId, async (newId) => {
  await store.loadUser(newId)
})
```
