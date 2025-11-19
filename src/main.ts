import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './config/DataBase';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // elimina propiedades no declaradas en el DTO
            forbidNonWhitelisted: true, // lanza error si hay propiedades desconocidas
            transform: true, // convierte tipos automáticamente
        }),
    );

    // Habilitar CORS
    app.enableCors();

    app.useGlobalFilters(new GlobalExceptionFilter());
    const port = configService.get<number>('PORT') || 5000;
    await app.listen(port);

    console.log(`Servidor ejecutándose en: http://localhost:${port}`);
}
bootstrap();