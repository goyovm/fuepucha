import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import conf from './utils/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (conf.dev) {
    const config = new DocumentBuilder()
      .setTitle('API Nodo10')
      .setDescription('API for managing Nodo10 resources')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(conf.swaggerPath, app, document);
  }
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
