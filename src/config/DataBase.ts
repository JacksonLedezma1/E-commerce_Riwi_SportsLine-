import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from '../common/middleware/loggin.middleware';
import { Usuario } from '../Usuarios/usuario.entity'
import { Cliente } from '../Clientes/cliente.entity'
import { Producto } from '../Productos/producto.entity'
import { Pedido } from '../Pedidos/pedido.entity'
import { ApiKey } from '../Auth/entities/api-key.entity';
import { OAuthUser } from '../Auth/entities/oauth-user.entity';
import { UsuariosModule } from "../Usuarios/usuario.model";
import { ProductosModel } from "../Productos/producto.model";
import { PedidosModel } from "../Pedidos/pedido.model";
import { ClientesModel } from "../Clientes/cliente.model";
import { AuthModule } from '../Auth/auth.module';

@Module({
    imports: [
        // Carga variables de entorno
        ConfigModule.forRoot({
            isGlobal: true, // disponible en toda la app
        }),

        // Configuración de TypeORM
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT || '5432'),
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASS,
            database: process.env.DATABASE_NAME,
            entities: [Usuario, Cliente, Producto, Pedido, ApiKey, OAuthUser],
            synchronize: true, // usar solo en desarrollo
        }),

        // Módulos principales
        UsuariosModule,
        ProductosModel,
        PedidosModel,
        ClientesModel,
        AuthModule
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*');
    }
}