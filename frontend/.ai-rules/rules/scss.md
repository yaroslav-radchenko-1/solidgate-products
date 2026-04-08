# SCSS Conventions

## Scoping

- Always use `<style scoped lang="scss">` in components — never unscoped
- Use `:deep()` only when targeting child component internals, and only when unavoidable

```scss
// ✅ Correct
<style scoped lang="scss">
.user-card { ... }
</style>

// ✅ When targeting child component internals
:deep(.third-party-input) {
  border-radius: 0.5rem;
}

// ❌ Never unscoped in components
<style lang="scss">
.user-card { ... }
</style>
```

---

## Global Styles

```
src/assets/
├── styles/
│   ├── _variables.scss   # SCSS variables / CSS custom properties
│   ├── _mixins.scss      # Reusable mixins
│   ├── _reset.scss       # CSS reset / normalize
│   └── _base.scss        # Base element styles
└── main.scss             # Imports all partials
```

Import global styles only in `main.ts` — never in components.

---

## Variables

Prefer CSS custom properties for values that need runtime theming; use SCSS variables for build-time constants:

```scss
// _variables.scss — CSS custom properties for theme
:root {
  --color-primary: #3b82f6;
  --color-text: #111827;
  --spacing-md: 1rem;
}

// Use in components
.button {
  color: var(--color-primary);
  padding: var(--spacing-md);
}
```

---

## Class Naming

Class names: **kebab-case** only. No camelCase, no underscores.

```scss
// ✅ Correct
.user-card { ... }
.user-card-header { ... }
.submit-button { ... }

// ❌ Wrong
.userCard { ... }
.user_card { ... }
```

---

## Units — rem Only

Use `rem` for all dimensions — never `px`. Exception: `0` can stay unitless.

```scss
// ✅ Correct
.component {
  font-size: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  gap: 1rem;
  border: 0;
}

// ❌ Wrong
.component {
  font-size: 16px;
  padding: 16px 24px;
}
```

---

## Mixins

Define in `src/assets/styles/_mixins.scss`. Use for repeated patterns:

```scss
// _mixins.scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

// In component
.label {
  @include text-ellipsis;
}
```

---

## Anti-Patterns

```scss
// ❌ Pixel values
.card { padding: 16px; margin-bottom: 8px; }

// ❌ Deep nesting (max 3 levels)
.a { .b { .c { .d { ... } } } }

// ❌ Hardcoded colors
.button { background: #3b82f6; }

// ❌ ID selectors
#submit-button { ... }
```