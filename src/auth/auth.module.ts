import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { refreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  imports: [ PassportModule, UsersModule, JwtModule.registerAsync({}),], // Configuracion dinamica
  providers: [AuthService, JwtStrategy, refreshTokenStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
