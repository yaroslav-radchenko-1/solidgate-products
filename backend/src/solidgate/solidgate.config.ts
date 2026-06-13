import { registerAs } from '@nestjs/config';
import { z } from 'zod';

// Keys are configured at runtime via the Settings panel (stored in the DB).
// These env vars are only an optional fallback for local development and
// MUST NOT contain real credentials — they default to empty.
const schema = z.object({
  SOLIDGATE_PUBLIC_KEY: z.string().default(''),
  SOLIDGATE_SECRET_KEY: z.string().default(''),
});

export const solidgateConfig = registerAs('solidgate', () => {
  const env = schema.parse(process.env);

  return {
    publicKey: env.SOLIDGATE_PUBLIC_KEY,
    secretKey: env.SOLIDGATE_SECRET_KEY,
  };
});
