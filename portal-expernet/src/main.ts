import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:5173', // URL par défaut de Vite
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Portal Expernet')
    .setDescription("Documentation de l'API du portail Expernet")
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Serveur de développement')
    .addTag('App', "Points d'entrée généraux")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/openapi.json',
    customSiteTitle: 'API Portal Expernet',
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
  console.log('Backend disponible sur : http://localhost:3000/api');
  console.log('Documentation Swagger   : http://localhost:3000/api/docs');
  console.log('Spec OpenAPI JSON       : http://localhost:3000/api/openapi.json');
}

await bootstrap();
