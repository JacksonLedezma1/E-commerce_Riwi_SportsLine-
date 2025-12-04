import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RolesGuard } from './common/guards/roles.guards';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.use(new LoggerMiddleware().use);
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
  .setTitle('API Example')
  .setDescription('Documentación de la API con Auth JWT')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
    'access-token', // Nombre para swagger
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
}
bootstrap();
