/**
 * Módulo Principal de la Aplicación (AppModule)
 * 
 * Este es el módulo raíz que NestJS carga al iniciar.
 * Aquí se configuran:
 * - Conexión a la base de datos PostgreSQL con TypeORM
 * - Carga de variables de entorno con ConfigModule
 * - Importación de todos los módulos funcionales (Usuarios, Productos, etc.)
 * - Configuración del middleware de logging
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from '../common/middleware/loggin.middleware';

// Importar todas las entidades de la base de datos
import { Usuario } from '../Usuarios/usuario.entity'
import { Cliente } from '../Clientes/cliente.entity'
import { Producto } from '../Productos/producto.entity'
import { Pedido } from '../Pedidos/pedido.entity'
import { ApiKey } from '../Auth/entities/api-key.entity';
import { OAuthUser } from '../Auth/entities/oauth-user.entity';

// Importar todos los módulos funcionales
import { UsuariosModule } from "../Usuarios/usuario.model";
import { ProductosModel } from "../Productos/producto.model";
import { PedidosModel } from "../Pedidos/pedido.model";
import { ClientesModel } from "../Clientes/cliente.model";
import { AuthModule } from '../Auth/auth.module';

/**
 * Decorador @Module define este archivo como un módulo de NestJS
 * Los módulos son la forma de organizar la aplicación en NestJS
 */
@Module({
    imports: [
        // ============================================
        // CONFIGURACIÓN DE VARIABLES DE ENTORNO
        // ============================================
        /**
         * ConfigModule: Carga las variables de entorno desde el archivo .env
         * - isGlobal: true hace que esté disponible en toda la aplicación
         *   sin necesidad de importarlo en cada módulo
         */
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // ============================================
        // CONFIGURACIÓN DE TYPEORM (BASE DE DATOS)
        // ============================================
        /**
         * TypeORM es el ORM (Object-Relational Mapping) que usamos
         * para interactuar con PostgreSQL mediante objetos de JavaScript/TypeScript
         * en lugar de escribir SQL directamente
         */
        TypeOrmModule.forRoot({
            // Tipo de base de datos (PostgreSQL en este caso)
            type: 'postgres',

            // Configuración de conexión - Lee las variables de entorno del .env
            host: process.env.DATABASE_HOST,           // ej: localhost
            port: parseInt(process.env.DATABASE_PORT || '5432'),  // ej: 5432
            username: process.env.DATABASE_USER,       // ej: postgres
            password: process.env.DATABASE_PASS,       // tu contraseña de postgres
            database: process.env.DATABASE_NAME,       // ej: riwi_sportsline

            /**
             * entities: Array con todas las entidades (tablas) de la BD
             * TypeORM usa estas clases para crear/actualizar las tablas automáticamente
             */
            entities: [Usuario, Cliente, Producto, Pedido, ApiKey, OAuthUser],

            /**
             * synchronize: true
             * ⚠️ IMPORTANTE: Solo usar en DESARROLLO
             * 
             * Esto hace que TypeORM sincronice automáticamente la estructura
             * de la base de datos con las entidades (crea/modifica tablas)
             * 
             * EN PRODUCCIÓN debe ser FALSE para evitar pérdida de datos
             */
            synchronize: true,
        }),

        // ============================================
        // MÓDULOS FUNCIONALES
        // ============================================
        /**
         * Importamos todos los módulos de nuestra aplicación
         * Cada módulo maneja una funcionalidad específica:
         */
        UsuariosModule,    // Gestión de usuarios del sistema
        ProductosModel,    // Catálogo de productos deportivos
        PedidosModel,      // Sistema de pedidos/órdenes
        ClientesModel,     // Gestión de clientes
        AuthModule         // Sistema de autenticación (API Keys, OAuth)
    ],
})

/**
 * AppModule implementa NestModule para poder configurar middleware
 */
export class AppModule implements NestModule {
    /**
     * Método configure: Aquí se registran los middleware
     * 
     * @param consumer - Objeto que permite aplicar middleware a rutas
     */
    configure(consumer: MiddlewareConsumer) {
        /**
         * Aplicar LoggingMiddleware a TODAS las rutas ('*')
         * Este middleware registra información de cada petición HTTP
         */
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }
}