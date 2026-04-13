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

  app.setGlobalPrefix('api', { exclude: [] });
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // SPA fallback: for any non-API GET that doesn't match a static file,
  // return index.html so Vue Router can handle the route.
  const indexPath = join(__dirname, '..', '..', 'public', 'index.html');
  let indexHtml: string | null = null;
  try {
    indexHtml = readFileSync(indexPath, 'utf8');
  } catch {
    indexHtml = null;
  }

  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.setNotFoundHandler((request, reply) => {
    if (request.method !== 'GET' || request.url.startsWith('/api')) {
      void reply.status(404).send({ message: 'Not Found', statusCode: 404 });

      return;
    }
    if (!indexHtml) {
      void reply.status(404).send({ message: 'Not Found', statusCode: 404 });

      return;
    }
    void reply.type('text/html').send(indexHtml);
  });

  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  await app.listen(config.port, '0.0.0.0');
}

void bootstrap();
