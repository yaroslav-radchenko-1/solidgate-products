import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { z } from 'zod';

const schema = z.object({
  DB_PATH: z.string().default(join(process.cwd(), 'dbstate', 'app.db')),
});

export const databaseConfig = registerAs('database', () => {
  const env = schema.parse(process.env);

  return { path: env.DB_PATH };
});
