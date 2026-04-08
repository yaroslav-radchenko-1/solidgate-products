# Testing Conventions

## Stack

- **Vitest** — test runner
- **Vue Test Utils** — component mounting
- **@pinia/testing** — store mocking

---

## File Location & Naming

Tests live in the module's `tests/` directory:

```
src/modules/ModuleName/
└── tests/
    ├── ComponentName.spec.ts
    └── useComposableName.spec.ts
```

Naming: `{Subject}.spec.ts` — always `.spec.ts`, never `.test.ts`.

---

## What to Test

| Test          | What                                               |
| ------------- | -------------------------------------------------- |
| Components    | Rendered output, user interactions, emitted events |
| Composables   | Return values, state changes, side effects         |
| Stores        | State mutations, actions, getters                  |

**Do not test:** implementation details, internal refs, private methods.

---

## Component Tests

```ts
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UserCard from '../components/UserCard/UserCard.vue'

describe('UserCard', () => {
  const defaultProps = {
    user: { id: '1', name: 'John', email: 'john@example.com' },
  }

  it('renders user name', () => {
    const wrapper = mount(UserCard, { props: defaultProps })
    expect(wrapper.text()).toContain('John')
  })

  it('emits close when button clicked', async () => {
    const wrapper = mount(UserCard, { props: defaultProps })
    await wrapper.find('[data-testid="close-btn"]').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
```

---

## Composable Tests

```ts
import { ref } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useUserProfile } from '../composables/useUserProfile'

describe('useUserProfile', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('returns loading state initially', () => {
    const { isLoading } = useUserProfile()
    expect(isLoading.value).toBe(false)
  })

  it('fetches profile on mount', async () => {
    const { profile, fetchProfile } = useUserProfile()
    await fetchProfile('user-1')
    expect(profile.value).not.toBeNull()
  })
})
```

---

## Store Tests

```ts
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../stores/userStore'

describe('userStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('loads profile', async () => {
    const store = useUserStore()
    await store.loadProfile('1')
    expect(store.profile).toBeDefined()
  })
})
```

---

## Store Mocking in Component Tests

```ts
import { createTestingPinia } from '@pinia/testing'
import { useUserStore } from '@/shared/stores/userStore'

const wrapper = mount(UserCard, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          user: { profile: { id: '1', name: 'John' } },
        },
      }),
    ],
  },
})

const store = useUserStore()
store.profile = { id: '2', name: 'Jane' } // override per test
```

---

## Test IDs

Use `data-testid` for element selection — never CSS classes or tag names:

```vue
<button data-testid="submit-btn">Submit</button>
```

```ts
wrapper.find('[data-testid="submit-btn"]')
```

---

## Anti-Patterns

```ts
// ❌ Testing implementation details
expect(wrapper.vm.internalRef.value).toBe(true)

// ❌ Snapshot tests for logic
expect(wrapper.html()).toMatchSnapshot()

// ❌ CSS class selectors in tests
wrapper.find('.submit-button')
```