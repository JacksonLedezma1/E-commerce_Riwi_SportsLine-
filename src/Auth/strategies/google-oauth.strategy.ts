import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
    private readonly logger = new Logger('GoogleOAuthStrategy');

    constructor(
        private configService: ConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
            callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || 'http://localhost:5000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, emails, displayName } = profile;
        const email = emails[0].value;

        this.logger.log(`Autenticación OAuth Google: ${email}`);

        try {
            const usuario = await this.authService.handleOAuthLogin(
                'google',
                id,
                email,
                displayName,
                accessToken,
                refreshToken,
            );

            done(null, usuario);
        } catch (error) {
            this.logger.error(`Error en autenticación OAuth: ${error.message}`);
            done(error, false);
        }
    }
}
