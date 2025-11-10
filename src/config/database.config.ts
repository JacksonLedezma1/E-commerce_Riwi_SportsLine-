import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const url = configService.get<string>('DB_URL');

  if (!url) {
    throw new Error('DB_URL no está definido en el archivo .env');
  }

  return {
    type: 'postgres',
    url,
    autoLoadEntities: true,
    synchronize: true, 
    logging: configService.get('NODE_ENV') !== 'production',
    ssl: {
      rejectUnauthorized: false, // necesario para Supabase
    },
  };
};