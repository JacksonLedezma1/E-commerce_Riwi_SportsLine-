/**
 * Archivo principal de la aplicación NestJS
 * 
 * Este archivo contiene la función bootstrap que inicializa y configura
 * toda la aplicación. Aquí se configuran:
 * - Pipes de validación globales
 * - Interceptores para logging y formateo de respuestas
 * - Filtros de excepciones
 * - CORS para permitir peticiones desde otros dominios
 * - Documentación Swagger/OpenAPI
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './config/DataBase';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Función principal que arranca la aplicación
 * Se ejecuta automáticamente al iniciar el servidor
 */
async function bootstrap() {
    // Crear la aplicación NestJS con el módulo raíz (AppModule)
    const app = await NestFactory.create(AppModule);

    // Obtener el servicio de configuración para acceder a variables de entorno
    const configService = app.get(ConfigService);

    // ============================================
    // PIPES GLOBALES - Validación de datos
    // ============================================
    /**
     * ValidationPipe: Valida automáticamente todos los DTOs
     * - whitelist: Elimina propiedades que no están en el DTO
     * - forbidNonWhitelisted: Lanza error si hay propiedades extras
     * - transform: Convierte tipos automáticamente (ej: "123" a número 123)
     */
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // ============================================
    // INTERCEPTORES GLOBALES - Procesamiento de requests
    // ============================================
    /**
     * LoggingInterceptor: Registra información de cada petición HTTP
     * ResponseInterceptor: Formatea las respuestas de forma consistente
     * 
     * Los interceptores se ejecutan en orden:
     * 1. LoggingInterceptor (registra tiempo de inicio)
     * 2. ResponseInterceptor (formatea la respuesta)
     */
    app.useGlobalInterceptors(
        new LoggingInterceptor(),
        new ResponseInterceptor(),
    );

    // ============================================
    // FILTROS GLOBALES - Manejo de errores
    // ============================================
    /**
     * GlobalExceptionFilter: Captura todas las excepciones no manejadas
     * y las convierte en respuestas HTTP apropiadas
     */
    app.useGlobalFilters(new GlobalExceptionFilter());

    // ============================================
    // CORS - Permitir peticiones desde otros dominios
    // ============================================
    /**
     * Habilita CORS para permitir que el frontend (u otros clientes)
     * puedan hacer peticiones a esta API desde diferentes dominios
     */
    app.enableCors();

    // ============================================
    // CONFIGURACIÓN DE SWAGGER/OPENAPI
    // ============================================
    /**
     * Swagger proporciona documentación interactiva de la API
     * Accesible en: http://localhost:5000/api
     */
    const config = new DocumentBuilder()
        // Información general de la API
        .setTitle('E-commerce Riwi SportsLine API')
        .setDescription('API REST para el sistema de e-commerce deportivo de Riwi SportsLine. Incluye gestión de usuarios, productos, clientes, pedidos y autenticación con API Keys.')
        .setVersion('1.0')

        // Tags para organizar los endpoints por módulo
        .addTag('Usuarios', 'Gestión de usuarios del sistema')
        .addTag('Productos', 'Catálogo de productos deportivos')
        .addTag('Clientes', 'Gestión de clientes')
        .addTag('Pedidos', 'Gestión de pedidos y órdenes')
        .addTag('Autenticación', 'Sistema de autenticación con API Keys y OAuth2')

        // Esquema de seguridad: API Key en header
        .addApiKey(
            {
                type: 'apiKey',
                name: 'x-api-key',
                in: 'header',
                description: 'API Key para autenticación. Obtén una en POST /auth/api-keys después de autenticarte.',
            },
            'api-key',
        )

        // Esquema de seguridad: Bearer Token (para futuro uso con JWT)
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Token JWT para autenticación (futuro)',
            },
            'bearer',
        )

        // Servidor de desarrollo
        .addServer('http://localhost:5000', 'Servidor de Desarrollo')
        .build();

    // Crear el documento de OpenAPI con toda la configuración
    const document = SwaggerModule.createDocument(app, config);

    // Configurar Swagger UI en la ruta /api
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Riwi SportsLine API Docs',
        customCss: '.swagger-ui .topbar { display: none }', // Ocultar barra superior
        swaggerOptions: {
            persistAuthorization: true,    // Mantener autenticación al recargar
            filter: true,                  // Activar buscador de endpoints
            displayRequestDuration: true,  // Mostrar tiempo de respuesta
        },
    });

    // ============================================
    // INICIAR SERVIDOR
    // ============================================
    // Obtener el puerto desde variables de entorno o usar 5000 por defecto
    const port = configService.get<number>('PORT') || 5000;

    // Iniciar el servidor en el puerto especificado
    await app.listen(port);

    // Mostrar mensajes informativos en consola
    console.log(`Servidor ejecutándose en: http://localhost:${port}`);
    console.log(`📚 Documentación Swagger disponible en: http://localhost:${port}/api`);
}

// Ejecutar la función bootstrap
// Si hay algún error fatal, se captura y se muestra en consola
bootstrap();