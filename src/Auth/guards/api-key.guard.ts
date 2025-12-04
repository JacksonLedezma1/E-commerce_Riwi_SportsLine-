/**
 * API KEY GUARD - Guard de Validación de API Keys
 * 
 * Este guard protege rutas verificando que la petición incluya
 * una API key válida en el header 'x-api-key'.
 * 
 * Flujo de validación:
 * 1. Verifica que el header x-api-key esté presente
 * 2. Valida que la API key sea válida y no esté expirada
 * 3. Verifica que la API key tenga los scopes (permisos) necesarios
 * 4. Adjunta información de la key al request para uso posterior
 * 
 * Ejemplo de uso:
 * @UseGuards(ApiKeyGuard)
 * @ApiScopes('read:products', 'write:products')
 * async miEndpoint() { ... }
 */

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

/**
 * @Injectable() - Permite que este guard sea inyectado en controllers
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
    private readonly logger = new Logger('ApiKeyGuard');

    /**
     * Constructor - Inyección de dependencias
     * 
     * @param authService - Servicio que contiene la lógica de validación de API keys
     * @param reflector - Para leer metadata (scopes requeridos)
     */
    constructor(
        private authService: AuthService,
        private reflector: Reflector,
    ) { }

    /**
     * Método principal que valida la API key y los scopes
     * 
     * @param context - Contexto de ejecución de NestJS
     * @returns Promise<boolean> - true si se permite el acceso
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // ============================================
        // PASO 1: Extraer el header x-api-key del request
        // ============================================
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        /**
         * Verificar que el cliente envió el header x-api-key
         * Si no está presente, denegar acceso inmediatamente
         */
        if (!apiKey) {
            this.logger.warn('Acceso denegado: x-api-key no proporcionada');
            throw new UnauthorizedException('x-api-key header requerido');
        }

        // ============================================
        // PASO 2: Validar la API key con el servicio de autenticación
        // ============================================
        /**
         * authService.validateApiKey() verifica:
         * - Que la key exista en la base de datos
         * - Que no esté expirada
         * - Que esté activa (no revocada)
         * 
         * Retorna el objeto ApiKey si es válida, null si no lo es
         */
        const validatedKey = await this.authService.validateApiKey(apiKey);

        if (!validatedKey) {
            this.logger.warn('Acceso denegado: x-api-key inválida o expirada');
            throw new UnauthorizedException('x-api-key inválida o expirada');
        }

        // ============================================
        // PASO 3: Verificar scopes (permisos granulares)
        // ============================================
        /**
         * Los scopes son permisos específicos que controlan qué puede hacer
         * cada API key. Ejemplos: 'read:products', 'write:orders', etc.
         * 
         * Usar Reflector para leer los scopes requeridos del decorador @ApiScopes
         */
        const requiredScopes = this.reflector.get<string[]>(
            API_SCOPES_KEY,
            context.getHandler(),
        );

        /**
         * Si el endpoint requiere scopes específicos, validarlos
         */
        if (requiredScopes && requiredScopes.length > 0) {
            // Verificar que la API key tenga TODOS los scopes requeridos
            const hasScopes = this.authService.validateScopes(validatedKey, requiredScopes);

            if (!hasScopes) {
                // La API key NO tiene los permisos necesarios
                this.logger.warn(
                    `API Key "${validatedKey.name}" no tiene los scopes requeridos: ${requiredScopes.join(', ')}`,
                );
                throw new ForbiddenException(
                    `Scopes requeridos: ${requiredScopes.join(', ')}`,
                );
            }
        }

        // ============================================
        // PASO 4: Adjuntar información al request
        // ============================================
        /**
         * Guardar la información de la API key en el request
         * para que los controllers puedan acceder a ella si la necesitan
         */
        request.apiKey = validatedKey;

        /**
         * Si la API key está asociada a un usuario específico,
         * también adjuntamos ese usuario al request
         */
        request.user = validatedKey.usuario;

        // ============================================
        // PASO 5: Acceso concedido
        // ============================================
        this.logger.debug(`API Key "${validatedKey.name}" validada exitosamente`);
        return true; // Permitir acceso al endpoint
    }
}
