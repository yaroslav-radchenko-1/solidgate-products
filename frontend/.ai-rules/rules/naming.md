# Naming Conventions

## Convention Table

| Entity         | Convention                  | Example                          |
| -------------- | --------------------------- | -------------------------------- |
| Modules        | PascalCase                  | `UserProfile`                    |
| Components     | PascalCase                  | `UserProfileHeader.vue`          |
| Composables    | camelCase + `use` prefix    | `useUserProfileData`             |
| Props types    | PascalCase + `Props`        | `UserProfileProps`               |
| Emits types    | PascalCase + `Emits`        | `UserProfileEmits`               |
| Return types   | PascalCase + `Returns`      | `UserProfileReturns`             |
| Enums          | PascalCase                  | `UserRole`                       |
| Enum files     | camelCase + `.enums.ts`     | `userProfile.enums.ts`           |
| Type files     | camelCase + `.types.ts`     | `userProfile.types.ts`           |
| Store files    | camelCase                   | `userStore.ts`                   |
| Const files    | camelCase + `.consts.ts`    | `userProfile.consts.ts`          |
| Composable files | camelCase + `use` prefix  | `useUserProfile.ts`              |
| Feature dirs   | PascalCase                  | `UserProfile/`                   |

## Boolean Variables

Must start with `is`, `has`, `can`, or `should`:

```ts
// ✅ Correct
const isLoading = ref(false)
const hasError = ref(false)
const canSubmit = computed(() => ...)
const shouldRefetch = ref(false)

// ❌ Wrong
const loading = ref(false)
const error = ref(false)
const isNotReady = ref(true)   // no negative booleans
```

## Functions

Use verbs:

```ts
// ✅ Correct
const getUser = () => ...
const calculateTotal = () => ...
const fetchProducts = () => ...

// ❌ Wrong
const user = () => ...
const total = () => ...
```

## Models (data structures)

Use nouns:

```ts
// ✅ Correct
interface UserProfile { ... }
interface OrderItem { ... }
```

## Event Handlers

- `on` prefix — for callback props passed to child components
- `handle` prefix — for handler functions defined in component

```ts
// ✅ Correct — prop name
defineProps<{ onSubmit: () => void }>()

// ✅ Correct — handler in component
const handleSubmit = () => { ... }
const handleInputChange = (value: string) => { ... }
```

## Anti-Patterns

```ts
// ❌ No Hungarian notation
const strName = 'John'
const btnSubmit = document.querySelector('button')
const arrUsers: User[] = []

// ❌ No I/T prefixes on types
interface IUser { ... }     // wrong
interface TUser { ... }     // wrong
interface User { ... }      // correct

// ❌ No negative booleans
const isNotReady = ref(true)    // wrong
const isReady = ref(false)      // correct
```

## File Naming

- Component folders: PascalCase (`UserProfile/`)
- Non-component files: camelCase with type suffix (`userProfile.types.ts`)
- Index files for re-exports: `index.ts`
