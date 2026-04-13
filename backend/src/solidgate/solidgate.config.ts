import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const schema = z.object({
  SOLIDGATE_PUBLIC_KEY: z
    .string()
    .default('api_pk_0bf6ecca_a325_4526_8631_4b577a90a9df'),
  SOLIDGATE_SECRET_KEY: z
    .string()
    .default('api_sk_618581bc_9f29_467a_93f6_876662a97ba8'),
});

export const solidgateConfig = registerAs('solidgate', () => {
  const env = schema.parse(process.env);

  return {
    publicKey: env.SOLIDGATE_PUBLIC_KEY,
    secretKey: env.SOLIDGATE_SECRET_KEY,
  };
});
