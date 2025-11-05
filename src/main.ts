import { NestFactory } from '@nestjs/core';
import { AppModule } from './config/DataBase';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Habilitar CORS
    app.enableCors();

    const port = configService.get<number>('PORT') || 5000;
    await app.listen(port);

    console.log(`Servidor ejecutándose en: http://localhost:${port}`);
}
bootstrap();