import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { RolesGuard } from './common/guards/roles.guards';
import { LoggingInterceptor } from './common/interceptors/logging.interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.use(new LoggerMiddleware().use);
  app.useGlobalFilters(new HttpExceptionFilter())
  app.useGlobalGuards(new RolesGuard(new Reflector()));
  app.useGlobalInterceptors(new LoggingInterceptor());
}
bootstrap();
