# Systematic Debugging

## Process

### 1. Reproduce
- Define exact steps to reproduce the bug
- Identify minimum reproduction case
- Note: browser, environment, user state

### 2. Understand
- Read the error message carefully — full stack trace, not just last line
- Identify what component/composable/store throws
- Check recent changes (git log, git diff)

### 3. Isolate
- Add `console.log` at entry points to narrow down
- Check reactive values with Vue DevTools
- Verify props, emits, store state
- Check network requests in DevTools

### 4. Fix
- Address root cause, not symptoms
- One change at a time
- Test the fix

### 5. Verify
- Confirm bug is gone
- Check for regressions in related functionality
- Remove debug logs

---

## Common Vue 3 Issues

### Reactivity not working
```ts
// ❌ Mutating array directly (not reactive)
store.items[0] = newItem

// ✅ Replace array or use reactive methods
store.items = store.items.map((item, i) => i === 0 ? newItem : item)
store.items.splice(0, 1, newItem)
```

### Stale computed values
- Check if all dependencies are reactive (`ref`, `reactive`, `computed`)
- Verify you're not reading `.value` inside reactive object

### Composable not updating
- Ensure composable returns reactive refs, not raw values
- Check that composable is called inside `setup()` context

### Pinia store not updating UI
- Confirm you're using store value reactively (not destructuring without `storeToRefs`)
```ts
// ❌ Loses reactivity
const { user } = useUserStore()

// ✅ Reactive refs
const { user } = storeToRefs(useUserStore())
```

---

## Useful Commands

```bash
# Check what changed recently
git log --oneline -20
git diff HEAD~1

# Find where something is used
grep -r "functionName" src/

# Check TypeScript errors
npm run type-check
```
