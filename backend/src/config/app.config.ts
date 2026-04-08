import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
});

export const appConfig = registerAs('app', () => {
  const env = schema.parse(process.env);

  return { port: env.PORT };
});
