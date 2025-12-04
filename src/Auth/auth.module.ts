import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ApiKey } from './entities/api-key.entity';
import { OAuthUser } from './entities/oauth-user.entity';
import { Usuario } from '../Usuarios/usuario.entity';
import { GoogleOAuthStrategy } from './strategies/google-oauth.strategy';
import { ApiKeyGuard } from './guards/api-key.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([ApiKey, OAuthUser, Usuario]),
        PassportModule.register({ defaultStrategy: 'google' }),
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        // GoogleOAuthStrategy,  // ⚠️ Temporarily disabled - requires GOOGLE_CLIENT_ID in .env
        ApiKeyGuard
    ],
    exports: [AuthService, ApiKeyGuard],
})
export class AuthModule { }
