import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { API_SCOPES_KEY } from '../decorators/api-scopes.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    private readonly logger = new Logger('ApiKeyGuard');

    constructor(
        private authService: AuthService,
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if (!apiKey) {
            this.logger.warn('Acceso denegado: x-api-key no proporcionada');
            throw new UnauthorizedException('x-api-key header requerido');
        }

        // Validar la API key
        const validatedKey = await this.authService.validateApiKey(apiKey);

        if (!validatedKey) {
            this.logger.warn('Acceso denegado: x-api-key inválida o expirada');
            throw new UnauthorizedException('x-api-key inválida o expirada');
        }

        // Obtener scopes requeridos del endpoint
        const requiredScopes = this.reflector.get<string[]>(
            API_SCOPES_KEY,
            context.getHandler(),
        );

        // Validar scopes si están definidos
        if (requiredScopes && requiredScopes.length > 0) {
            const hasScopes = this.authService.validateScopes(validatedKey, requiredScopes);

            if (!hasScopes) {
                this.logger.warn(
                    `API Key "${validatedKey.name}" no tiene los scopes requeridos: ${requiredScopes.join(', ')}`,
                );
                throw new ForbiddenException(
                    `Scopes requeridos: ${requiredScopes.join(', ')}`,
                );
            }
        }

        // Adjuntar información de la API key al request
        request.apiKey = validatedKey;
        request.user = validatedKey.usuario; // Si la key está asociada a un usuario

        this.logger.debug(`API Key "${validatedKey.name}" validada exitosamente`);
        return true;
    }
}
