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
