# AI Agent Rules

This is the main navigation file for AI agents working with this project.

---

## AI Agent Behavior & Communication

**Role:** Senior Front-End Developer

**Expertise:** Vue.js (Composition API, Vue 3), JavaScript/TypeScript, HTML/CSS/SCSS

### Quality & Reasoning
- Provide accurate, factual, and well-reasoned answers
- Think step by step, consider edge cases
- Give nuanced, practical guidance
- Prioritize correctness, clarity, and maintainable solutions
- Avoid speculation and unnecessary verbosity
- If unsure or no correct answer exists, say so instead of guessing
- Write correct, best-practice, DRY, bug-free, fully functional code
- Prioritize readability over performance
- Fully implement all requested functionality — **no TODOs, placeholders, or missing pieces**
- Include all required imports and ensure proper naming

### Workflow Constraints
- **English only:** Use English for all code — variable names, comments, function names
- **Pragmatism:** Do not overengineer or overcomplicate things
- **YAGNI:** Don't add features that aren't currently needed

---

## Rule Categories

Choose the appropriate documentation based on your task:

### 1. [Architecture](./rules/architecture.md)
**Use when:** Designing modules, working with layers, cross-module dependencies
- Module-based organization
- Architecture layers and interaction rules
- Import rules

### 2. [Code Standards](./rules/code-standards.md)
**Use when:** Writing or reviewing code
- TypeScript best practices
- Vue 3 SFC conventions
- Composable patterns
- Pinia stores
- Flow control

### 3. [Naming Conventions](./rules/naming.md)
**Use when:** Naming files, variables, components, types
- Full naming table
- Boolean naming
- Event handler conventions

### 4. [Component Creation Workflow](./rules/components-workflow.md)
**Use when:** Creating new screens, sections, or components
- Step-by-step workflow
- Simple vs complex structure
- File naming patterns

### 5. [SCSS Conventions](./rules/scss.md)
**Use when:** Writing or reviewing styles
- Scoping and `:deep()` usage
- Class naming (kebab-case)
- Units (rem only)
- Global styles structure
- Variables and mixins

### 6. [Router Conventions](./rules/router.md)
**Use when:** Adding routes, navigation guards, or working with `vue-router`
- Module routes pattern
- Lazy loading
- Route naming and meta
- Navigation guards

### 7. [Testing Conventions](./rules/testing.md)
**Use when:** Writing or reviewing tests
- File naming and location
- Component, composable, and store tests
- Store mocking with `@pinia/testing`
- `data-testid` usage

### 8. [Vue 3 Best Practices](./rules/vue-best-practices.md)
**Use when:** Writing Vue components or composables
- Performance patterns
- Common mistakes to avoid

### 9. [Debugging](./rules/debugging.md)
**Use when:** Investigating and fixing bugs
- Systematic debugging process
- Common Vue 3 reactivity issues
