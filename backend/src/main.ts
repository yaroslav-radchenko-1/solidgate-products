import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigType } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';
import { AppModule } from './app.module';
import { appConfig } from './config/app.config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // SPA fallback: rewrite 404 responses on non-API GET requests to
  // index.html so Vue Router can handle client-side routes.
  const indexPath = join(__dirname, '..', '..', 'public', 'index.html');
  let indexHtml: string | null = null;
  try {
    indexHtml = readFileSync(indexPath, 'utf8');
  } catch {
    indexHtml = null;
  }

  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.addHook('onSend', async (request, reply, payload) => {
    if (
      indexHtml &&
      reply.statusCode === 404 &&
      request.method === 'GET' &&
      !request.url.startsWith('/api')
    ) {
      void reply.code(200).type('text/html; charset=utf-8');

      return indexHtml;
    }

    return payload;
  });

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  await app.listen(config.port, '0.0.0.0');
}

void bootstrap();
