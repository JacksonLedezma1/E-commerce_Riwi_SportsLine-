import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { RolsModule } from 'src/rols/rols.module';

@Module({
  imports: [ PassportModule, UsersModule, RolsModule, JwtModule.registerAsync({
    useFactory: (config: ConfigService) => ({
      secret: config.get('JWT_SECRET'),
      signOptions: { expiresIn: '15m' },
    }),
    inject: [ConfigService],
  }),
  TypeOrmModule.forFeature([User]),
],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
