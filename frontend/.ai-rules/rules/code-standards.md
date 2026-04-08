# Code Standards & Best Practices

## Core Principles

All code must adhere to:
- **SOLID** — resilience to changes, clear responsibility
- **KISS** — simplicity of implementation
- **DRY** — avoid duplication
- **YAGNI** — avoid unnecessary complexity and features
- **Clean Code** — style, naming, structure

---

## TypeScript Standards

### Strict Type Safety
- **`any` is STRICTLY PROHIBITED**
- **No inline types** — extract to proper type declarations
- Explicit typing for non-primitive types
- Type `ref` and `computed` explicitly when the default value is absent or type is non-obvious
- Export types separately: `import type { ... }`
- No `I`, `T` prefixes on types/interfaces

### interface vs type
- **`interface`** — for object contracts (declaration merging, extends)
- **`type`** — for utilities, aliases, unions, mapped/conditional types, data models

```ts
// interface for object contracts
interface UserProfile {
  id: string
  name: string
}

// type for unions, aliases, mapped types
type UserId = string
type UserRole = 'admin' | 'user' | 'guest'
type PartialUser = Partial<UserProfile>
```

### Enums over Union Types
Prefer `enum` or `const enum` over union types for fixed value sets:

```ts
// ✅ Preferred
enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}

// Use only for simple cases
type Status = 'active' | 'inactive'
```

---

## Vue 3 SFC Conventions

### Script Block Order

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useFeature } from './composables/useFeature'

// 2. Props & Emits
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 3. Composables
const { data, isLoading } = useFeature()

// 4. Reactive state
const isOpen = ref(false)

// 5. Computed
const displayName = computed(() => ...)

// 6. Watchers
watch(isOpen, () => { ... })

// 7. Methods
const handleSubmit = () => { ... }

// 8. Lifecycle hooks
onMounted(() => { ... })
</script>

<template>
  <!-- Single root element preferred -->
</template>

<style scoped lang="scss">
/* Component styles */
</style>
```

### Rules
- **Always use `<script setup lang="ts">`** — no Options API ever
- **Always use `scoped` styles** — prevents CSS leaking
- Keep templates readable — extract complex logic to computed/methods

### Props & Emits

```ts
// ✅ Type-based props declaration
const props = defineProps<{
  title: string
  isVisible?: boolean
}>()

// ✅ With defaults
const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
})

// ✅ Typed emits
const emit = defineEmits<{
  submit: [value: string]
  close: []
}>()
```

### v-model — Use defineModel (Vue 3.4+)

```ts
// ✅ Correct — Vue 3.4+
const modelValue = defineModel<string>()

// ❌ Wrong — manual pattern
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
```

### Template Directives
- Use `v-show` for **frequent** toggling (element stays in DOM)
- Use `v-if` / `v-else` for **conditional rendering** (element removed from DOM)
- Use `<component :is="">` over long `v-if` / `v-else-if` chains for dynamic components
- Use `v-memo` for expensive renders
- Use `v-once` for static content
- Use semantic HTML tags

---

## Composable Patterns

### Structure Rules
- **One composable = one responsibility (SRP)**
- **Always return an object** (not a ref, array, or primitive directly)
- **3–7 return properties** — if more, split the composable
- **50–100 lines** — if longer, compose multiple composables
- Always specify return types
- Explicitly type reactive state and params

```ts
// ✅ Correct
export const useUserProfile = (): UserProfileReturns => {
  const store = useUserStore()

  const isLoading = ref(false)
  const profile = computed(() => store.profile)

  const fetchProfile = async (id: string) => {
    isLoading.value = true
    await store.loadProfile(id)
    isLoading.value = false
  }

  return { isLoading, profile, fetchProfile }
}

// ❌ Wrong — returns primitive
export const useCounter = () => ref(0)

// ❌ Wrong — too many responsibilities
export const useEverything = () => { ... } // 400 lines
```

### Composing Composables

For complex scenarios, compose multiple composables:

```ts
export const useCheckout = () => {
  const { cart, total } = useCart()
  const { isProcessing, processPayment } = usePayment()
  const { address } = useShipping()

  return { cart, total, isProcessing, address, processPayment }
}
```

---

## Pinia Stores

- **Setup syntax only** — no Options API stores
- No direct state mutation from outside the store
- Use actions for all state changes

```ts
// ✅ Setup syntax
export const useUserStore = defineStore('user', () => {
  const profile = ref<UserProfile | null>(null)
  const isLoading = ref(false)

  const loadProfile = async (id: string) => {
    isLoading.value = true
    profile.value = await UserApiService.fetchUser(id)
    isLoading.value = false
  }

  return { profile, isLoading, loadProfile }
})

// ❌ Options API — never use
export const useUserStore = defineStore('user', {
  state: () => ({ ... }),
  actions: { ... },
})
```

---

## Flow Control

- **Guard clauses and early returns** — avoid deep nesting

```ts
// ✅ Correct — guard clauses
const processUser = (user: User | null) => {
  if (!user) return
  if (!user.isActive) return

  // main logic here
  doSomething(user)
}

// ❌ Wrong — deep nesting
const processUser = (user: User | null) => {
  if (user) {
    if (user.isActive) {
      doSomething(user)
    }
  }
}
```
