# Architecture

## Module-Based Organization

The project follows a **domain-driven, module-based architecture**. Features are organized into self-contained modules under `src/modules/`, each representing a distinct business domain or feature area.

- Each module owns its components, composables, types, and business logic
- Modules can use shared resources from `src/shared/` (stores, services, types)
- Reusable UI components live in `src/ui/` (design system)
- Cross-module dependencies go through shared abstractions

## Architecture Layers

```
┌─────────────────────────────────────┐
│         UI Components               │  ← Presentation, user events (.vue)
├─────────────────────────────────────┤
│         Composables                 │  ← Reactive business logic (use* prefix)
├─────────────────────────────────────┤
│         Pinia Stores                │  ← Centralized state, caching
├─────────────────────────────────────┤
│         Service Layer               │  ← Singleton services, cross-module logic
├─────────────────────────────────────┤
│         External APIs               │  ← HTTP requests, 3rd party integrations
└─────────────────────────────────────┘
```

## Layer Rules

**Unidirectional flow** — each layer can only call layers below:

- ✅ Components → Composables
- ✅ Composables → Stores or Services
- ✅ Stores → Services
- ❌ Components → Stores directly (must go through Composables)
- ❌ Components → Services directly (must go through Composables)
- ❌ Stores → Composables (forbidden)

**Module isolation:**

- Modules should be loosely coupled
- Communicate via `src/shared/` abstractions
- No direct cross-module imports

**All inter-layer contracts must be typed with TypeScript.**

## Module Structure

Each feature module follows this structure:

```
src/modules/ModuleName/
├── ModuleName.vue        # Root component (optional)
├── index.ts              # Re-export / public API
├── routes.ts             # Module route definitions
├── components/           # Module-specific components
├── composables/          # Module-specific composables
├── consts/               # Constants (.consts.ts files)
├── enums/                # Enums (.enums.ts files)
├── guards/               # Navigation guards
├── stores/               # Module-level Pinia stores
├── types/                # Type definitions (.types.ts files)
├── styles/               # Module-specific styles (optional)
├── tests/                # Module-specific tests
└── views/                # Page-level view components
```

## Project Structure

```
src/
├── modules/              # Feature modules (domain-driven)
│   └── ModuleName/
├── shared/               # Cross-module shared resources
│   ├── stores/           # Global Pinia stores
│   ├── services/         # Singleton services
│   ├── composables/      # Shared composables
│   └── types/            # Shared type definitions
├── ui/                   # Design system / reusable UI components
├── router/               # Vue Router configuration
├── assets/               # Fonts, images, global styles
└── main.ts               # App entry point
```

## Import Rules

- **Relative** (`./`, `../`) — within the same module, max 2 levels deep (`../../`)
- **Absolute** (`@/`) — cross-module imports

```ts
// ✅ Within same module — relative
import { useUserData } from './composables/useUserData'
import type { UserProps } from '../types/user.types'

// ✅ Cross-module — absolute
import { useAuthStore } from '@/shared/stores/authStore'
import { UserAvatar } from '@/ui/UserAvatar'

// ❌ Too deep — use absolute instead
import { something } from '../../../shared/utils'
```
