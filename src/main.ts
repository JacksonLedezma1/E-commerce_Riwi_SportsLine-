import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './config/DataBase';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

    // Configuración de Swagger
    const config = new DocumentBuilder()
        .setTitle('E-commerce Riwi SportsLine API')
        .setDescription('API REST para el sistema de e-commerce deportivo de Riwi SportsLine. Incluye gestión de usuarios, productos, clientes, pedidos y autenticación con API Keys.')
        .setVersion('1.0')
        .addTag('Usuarios', 'Gestión de usuarios del sistema')
        .addTag('Productos', 'Catálogo de productos deportivos')
        .addTag('Clientes', 'Gestión de clientes')
        .addTag('Pedidos', 'Gestión de pedidos y órdenes')
        .addTag('Autenticación', 'Sistema de autenticación con API Keys y OAuth2')
        .addApiKey(
            {
                type: 'apiKey',
                name: 'x-api-key',
                in: 'header',
                description: 'API Key para autenticación. Obtén una en POST /auth/api-keys después de autenticarte.',
            },
            'api-key',
        )
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token JWT para autenticación (futuro)',
            },
            'bearer',
        )
        .addServer('http://localhost:5000', 'Servidor de Desarrollo')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Riwi SportsLine API Docs',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            persistAuthorization: true,
            filter: true,
            displayRequestDuration: true,
        },
    });

    const port = configService.get<number>('PORT') || 5000;
    await app.listen(port);

    console.log(`Servidor ejecutándose en: http://localhost:${port}`);
    console.log(`📚 Documentación Swagger disponible en: http://localhost:${port}/api`);
}
bootstrap();