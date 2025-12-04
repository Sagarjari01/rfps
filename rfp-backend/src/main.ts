import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.enableCors(); // Allow React to talk to this
  await app.listen(5001, '0.0.0.0');
  console.log(`Server running on ${await app.getUrl()}`);
}
bootstrap();
