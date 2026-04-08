# Backend — NestJS API Server

@.ai-rules/main.md

## Technologies

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Framework | NestJS 11 (Fastify)                |
| Language  | TypeScript                          |
| ORM       | TypeORM (better-sqlite3)            |
| Validation| class-validator, class-transformer  |
| Config    | @nestjs/config + Zod               |
| Testing   | Jest                                |

---

## File Structure

```
src/
├── main.ts               # Entry point — sets /api prefix, ValidationPipe, starts server
├── app.module.ts         # Root module — imports feature modules + TypeORM + ServeStaticModule
├── data-source.ts        # Standalone TypeORM DataSource for CLI (migration:generate/run)
├── config/               # App-level configs (app.config.ts, database.config.ts)
├── migrations/           # TypeORM migrations — auto-run on startup
└── common/               # Shared utilities across all modules
```

---

## Key Scripts

| Script                  | Purpose                            |
| ----------------------- | ---------------------------------- |
| `npm run dev`           | Dev server (from project root)     |
| `npm run build`         | Production build                   |
| `npm run test`          | Run all tests (from project root)  |
| `npm run migration:generate` | Generate migration after entity change |

---

## Key Conventions

- `ValidationPipe({ whitelist: true, transform: true })` is registered globally — strips unknown fields, transforms body to DTO class instances
- Always use `npm run dev` from the project root — not `npm run start:dev` from this directory
---

## Quality Gates — Mandatory

After every code change, run and fix all errors before considering the task done:

```bash
npm run lint       # ESLint
npm test           # Jest
```

Never leave linting, formatting, or test errors unresolved.
