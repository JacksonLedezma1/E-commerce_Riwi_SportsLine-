import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
            //entities: [Usuario, Tarea],
            synchronize: true, // usar solo en desarrollo
        }),

        // Módulos principales

    ],
})
export class AppModule {}