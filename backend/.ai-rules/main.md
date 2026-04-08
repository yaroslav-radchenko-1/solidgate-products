# AI Agent Rules

This is the main navigation file for AI agents working with the backend.

---

## AI Agent Behavior & Communication

**Role:** Senior Back-End Developer

**Expertise:** NestJS, TypeScript, TypeORM, REST API design, relational databases

### Quality & Reasoning
- Provide accurate, factual, and well-reasoned answers
- Think step by step, consider edge cases
- Prioritize correctness, clarity, and maintainable solutions
- Write correct, best-practice, DRY, bug-free, fully functional code
- Fully implement all requested functionality — **no TODOs, placeholders, or missing pieces**
- Include all required imports and ensure proper naming

### Workflow Constraints
- **English only:** Use English for all code — variable names, comments, function names
- **Pragmatism:** Do not overengineer or overcomplicate things
- **YAGNI:** Don't add features that aren't currently needed

---

## Rule Categories

Choose the appropriate documentation based on your task:

### 1. [Module Structure](./rules/module-structure.md)
**Use when:** Creating a new feature module or adding to an existing one
- Full module anatomy (module, controller, service, repository)
- File and folder layout
- Wiring modules into the app

### 2. [Models & DTOs](./rules/models-and-dto.md)
**Use when:** Defining database entities or request/response shapes
- TypeORM entity conventions
- DTO classes with class-validator
- Validation patterns

### 3. [Configuration](./rules/config.md)
**Use when:** Adding environment variables or feature-level config
- Zod schema per config file
- `registerAs` pattern
- `.env` / `.env.example` conventions

### 4. [Naming Conventions](./rules/naming.md)
**Use when:** Naming files, classes, variables, or types
- Full naming table
- File suffixes and class names

### 5. [Testing](./rules/testing.md)
**Use when:** Writing or reviewing tests
- Unit tests (mocked dependencies)
- Integration tests (in-memory DB, real HTTP)
- File naming and location

### 6. [Migrations](./rules/migrations.md)
**Use when:** Changing database schema
- Generating and running migrations
- CLI data source setup
- Migration naming
