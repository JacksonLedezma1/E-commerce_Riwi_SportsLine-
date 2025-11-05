import { NestFactory } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { Module } from '@nestjs/common'
import Config from './config/config'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = Config()

  // Configurar el puerto dinámicamente desde las variables de entorno
  await app.listen(config.port)

  console.log(`App succesfully running on Port: ${config.port}`)
}

bootstrap()
