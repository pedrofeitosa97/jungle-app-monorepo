import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'http://web:5173'],
  });
  await app.listen(3003);
  console.log('🚀 Notifications Service rodando em ws://localhost:3003');
}
bootstrap();
