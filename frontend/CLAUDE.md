# Frontend

@.ai-rules/main.md

## Technologies

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Framework  | Vue 3.5 (Composition API, `<script setup>`) |
| Build      | Vite, TypeScript                            |
| State      | Pinia (setup syntax only)                   |
| Routing    | Vue Router                                  |
| Styles     | SCSS                                        |
| HTTP       | Axios                                       |
| Quality    | ESLint, Oxlint, Prettier                    |
| Testing    | Vitest, Vue Test Utils                      |

---

## Key Scripts

| Script               | Purpose                          |
| -------------------- | -------------------------------- |
| `npm run dev`        | Dev server (port 5173)           |
| `npm run build`      | Production build + type-check    |
| `npm run preview`    | Preview production build locally |
| `npm run lint`       | Lint all files (ESLint + Oxlint) |
| `npm run format`     | Format with Prettier             |
| `npm run type-check` | TypeScript check                 |
| `npm run test:unit`  | Run unit tests (Vitest)          |
| `npm run test:e2e`   | Run e2e tests (Playwright)       |

---

## Environment Variables

All prefixed with `VITE_` (accessed via `import.meta.env`):
- `VITE_API_URL` — Backend API base URL
- `VITE_APP_ENV` — Environment (`dev`, `prod`)

---

## Quality Gates — Mandatory

After every code change, run and fix all errors before considering the task done:

```bash
npm run lint       # ESLint + Oxlint
npm run format     # Prettier
npm run type-check # TypeScript
```

Never leave linting, formatting, or type errors unresolved.
