# Component Creation Workflow

## Before Creating a New Component

**ALWAYS check these locations first:**

1. UI library (`src/ui/`) — design system components
2. `src/modules/common/` or shared components
3. Existing feature modules

**Only create a new component if it doesn't exist and can't be composed from existing ones.**

---

## Module Structure Patterns

We follow **modular architecture** where each component is organized in its own directory.

### Simple Component Structure

For components with minimal logic:

```
src/modules/FeatureName/components/ComponentName/
├── index.ts              # export { default } from './ComponentName.vue'
├── ComponentName.vue     # Main component
└── componentName.types.ts # Types (if needed)
```

### Complex Component Structure

For components with child components and business logic:

```
src/modules/FeatureName/
├── index.ts
├── FeatureName.vue          # Root component
├── types/
│   └── featureName.types.ts
├── components/              # Child components
│   └── ChildComponent/
│       ├── index.ts
│       ├── ChildComponent.vue
│       └── types/
│           └── childComponent.types.ts
├── composables/
│   ├── useFeatureData.ts
│   └── useFeatureActions.ts
├── consts/
│   └── featureName.consts.ts
├── enums/
│   └── featureName.enums.ts
└── tests/
    └── FeatureName.spec.ts
```

---

## When to Use Each Structure

**Use Simple Structure when:**
- Minimal or no child components
- No complex business logic
- Types can be in a single file
- No reusable helper functions

**Use Complex (Modular) Structure when:**
- Multiple child components
- Business logic should be extracted to composables
- Multiple type definitions
- Component will grow and needs clear organization

---

## Component Template

```vue
<script setup lang="ts">
// 1. Imports
import { ref, computed } from 'vue'

// 2. Props & Emits
const props = defineProps<{
  title: string
  isVisible?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

// 3. Composables (if any)

// 4. Reactive state
const isExpanded = ref(false)

// 5. Computed
const displayTitle = computed(() => props.title.trim())

// 6. Methods
const handleClose = () => emit('close')
</script>

<template>
  <div class="component-name">
    <!-- template content -->
  </div>
</template>

<style scoped lang="scss">
.component-name {
  // styles in rem
}
</style>
```

---

## Directory Naming Rules

| Entity           | Convention   | Example                        |
| ---------------- | ------------ | ------------------------------ |
| Module folders   | PascalCase   | `UserProfile/`                 |
| Component folders | PascalCase  | `UserAvatar/`                  |
| Composable files | camelCase    | `useUserProfile.ts`            |
| Type files       | camelCase    | `userProfile.types.ts`         |
| Const files      | camelCase    | `userProfile.consts.ts`        |
| Enum files       | camelCase    | `userProfile.enums.ts`         |

---

## index.ts Pattern

Always create `index.ts` for clean imports:

```ts
// Default export re-export
export { default } from './ComponentName.vue'

// Named exports (if types/consts are used outside)
export type { ComponentNameProps } from './types/componentName.types'
```
