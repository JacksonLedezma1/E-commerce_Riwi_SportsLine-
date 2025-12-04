import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './config/DataBase';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Pipes globales
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // elimina propiedades no declaradas en el DTO
            forbidNonWhitelisted: true, // lanza error si hay propiedades desconocidas
            transform: true, // convierte tipos automáticamente
        }),
    );

    // Interceptores globales
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new ResponseInterceptor(),
    );

    // Filtros globales
    app.useGlobalFilters(new GlobalExceptionFilter());

    // Habilitar CORS
    app.enableCors();

    const port = configService.get<number>('PORT') || 5000;
    await app.listen(port);

    console.log(`Servidor ejecutándose en: http://localhost:${port}`);
}
bootstrap();