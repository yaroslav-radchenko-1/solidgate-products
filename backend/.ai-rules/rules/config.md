# Configuration

Each config file owns its own Zod schema — there is no central env registry.

---

## Feature Config Pattern

File: `<feature>.config.ts` inside the module folder.

```typescript
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  ORDERS_MAX_PAGE_SIZE: z.coerce.number().int().positive().default(100),
  ORDERS_EXPORT_ENABLED: z.coerce.boolean().default(false),
});

export const ordersConfig = registerAs('orders', () => {
  const env = schema.parse(process.env);

  return {
    maxPageSize: env.ORDERS_MAX_PAGE_SIZE,
    exportEnabled: env.ORDERS_EXPORT_ENABLED,
  };
});
```

### Usage in a Service

```typescript
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ordersConfig } from '../orders.config';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ordersConfig.KEY)
    private readonly config: ConfigType<typeof ordersConfig>,
  ) {}

  public getMaxPageSize(): number {
    return this.config.maxPageSize;
  }
}
```

---

## Wiring Config Into a Module

```typescript
import { ConfigModule } from '@nestjs/config';
import { ordersConfig } from './orders.config';

@Module({
  imports: [ConfigModule.forFeature(ordersConfig)],
  // ...
})
export class OrdersModule {}
```

---

## App-Level Configs

Global configs live in `src/config/` and are loaded in `app.module.ts` via `ConfigModule.forRoot({ load: [...] })`.

Existing app-level configs:
- `app.config.ts` — `PORT`
- `database.config.ts` — `DB_PATH`

---

## .env Conventions

- `.env` is git-ignored — local overrides only
- `.env.example` lists all env vars (commented out with defaults)
- When adding a new env var — add it to `.env.example`
- Never put real secrets into `.env.example`
- In production, secrets are set via the hosting platform (Railway)
