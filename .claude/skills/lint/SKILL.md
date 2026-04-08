---
name: lint
description: Format and fix all code style issues in the backend and frontend
---

# Format and fix code

When the user invokes this skill, do everything automatically without asking any questions:

## Backend

1. Run ESLint with auto-fix in the backend directory:
   ```
   cd backend && npm run lint
   ```

2. If there are errors that could not be fixed automatically, fix them in the code manually, then run lint again.

3. Repeat until there are no errors remaining.

## Frontend

4. Run lint, format, and type-check in the frontend directory:
   ```
   cd frontend && npm run lint && npm run format && npm run type-check
   ```

5. If there are errors that could not be fixed automatically, fix them in the code manually, then run the failed command again.

6. Repeat until there are no errors remaining.

## Done

Tell the user: "Code is formatted and clean."
