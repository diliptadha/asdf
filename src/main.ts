import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { endpoints } from './utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Remote Hire')
    .setDescription('The remoteHire API description')
    .setVersion('1.0')
    .addTag(endpoints.user, 'Endpoints related to user')
    .addTag(endpoints.applyAsEngineer, 'Endpoints related to applyAsEngineer')
    .addTag(endpoints.myteam, 'Endpoints related to myteam')
    .addTag(endpoints.devdashboard, 'Endpoints related to devdashboard')
    .addTag(endpoints.document, 'Endpoints related to document')
    .addTag(endpoints.hiretopengineer, 'Endpoints related to hiretopengineer')
    .addTag(endpoints.home, 'Endpoints related to home')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT Token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: '', // Optional: Customize the Swagger UI title
  });
  app.enableCors();
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
