import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config(); 

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres', 
  host: process.env.DB_HOST || 'localhost', 
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'usuario',
  password: process.env.DB_PASSWORD || 'contraseña',
  database: process.env.DB_DATABASE || 'base_de_datos',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'], // Auto-detect the entities
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync only in development
  logging: process.env.NODE_ENV === 'development', // Only log in development
};