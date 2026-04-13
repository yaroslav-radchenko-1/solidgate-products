# Project Template — Full-Stack Vue + NestJS

## User profile

This project is aimed at non-developers. Do not ask the user to run commands, fix code, or resolve errors manually — do it yourself. Only ask for confirmation before destructive actions (e.g. deleting files, force-pushing, dropping data).

Before implementing any non-trivial change, propose a plan in plain language (what will be done and why) and wait for approval before proceeding.

## Architecture

- **Frontend**: Vue 3 + Vite + TypeScript + Pinia + Vue Router — `/frontend/`, port 5173, see `frontend/CLAUDE.md`
- **Backend**: NestJS 11 + TypeScript — `/backend/`, port 3000, see `backend/CLAUDE.md`
- In production, NestJS serves the built Vue app as static files from `backend/public/`

## Commands (run from project root)

- `npm install` — install all dependencies (triggers postinstall for both backend and frontend)
- `npm run dev` — start both dev servers in parallel (frontend :5173, backend :3000)
- `npm run build` — production build (frontend → copy to backend/public → backend build)
- `npm start` — start production server (single port 3000 serves both API and frontend)
- `npm test` — run all tests (backend Jest + frontend Vitest)

## File structure

```
/
├── package.json          # Root orchestration (dev, build, start, test)
├── backend/              # NestJS API server — see backend/CLAUDE.md
├── frontend/             # Vue 3 SPA — see frontend/CLAUDE.md
```

## Git Workflow

- When asked to save/commit/push changes — commit and push to remote only. Do **not** create PRs.
- A pre-commit hook (`.githooks/pre-commit`) enforces quality checks automatically. If it fails — fix the issues and retry.

---

## Current Feature: Solidgate Product Creation Tool

### What it does
A web tool at `/products/create` for creating payment products via the Solidgate API with a spreadsheet-like pricing table supporting 70+ countries with drag-fill, currency conversion, and country autocomplete.

### Completed (all working)
- **Product form**: Type (one-time/recurring), billing period, trial settings, retry config
- **Pricing spreadsheet**: 13 country groups (~70 countries), drag-fill, right-click context menu, add/remove rows
- **Country autocomplete**: 252 countries from CSV, bidirectional name↔code lookup, validation on blur
- **Currency conversion**: Exchange rates from open.er-api.com, cached 1hr server-side
- **API integration**: Backend proxy to Solidgate with HMAC-SHA512 signing
- **Settings panel**: API key management (stored in SQLite)
- **Submission progress**: Step-by-step status bar
- **Description field + auto-generated Name**: Name computed from description + default USD price + billing periods
- **Save/load templates**: Backend CRUD module (`/api/templates`), frontend TemplateManager component

### In Progress — Three Fixes (plan approved, not yet implemented)
See plan file: `.claude/plans/flickering-waddling-quasar.md`

1. **Name generation**: Strip "days" from billing period in generated name (e.g. `7.49/28 || desc` not `7.49/28 days || desc`). Change in `useProductCreation.ts` `generatedName` computed.
2. **Templates UX**: (a) Remove Load button, auto-load when selecting from dropdown. (b) Fix save not refreshing the dropdown — component needs to await the async save before calling fetchList.
3. **Column-aware drag-fill**: Currently drags ALL columns at once. Change to: single drag handle = one column only. Shift+click drag handle = add column to selection. Needs new `selectedDragColumns` state and column param in `startDragFill`.

### Key decisions made
- Solidgate API keys: stored in Settings DB, fallback to env vars
- Drag-fill: Shift+click on drag handles to multi-select columns (not Ctrl+click headers, not checkboxes)
- Templates: auto-load on dropdown select (no separate Load button)
- `payment_action` hardcoded to `auth_settle`, `settle_interval` to `120`
