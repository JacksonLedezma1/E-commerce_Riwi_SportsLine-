/**
 * ROLES GUARD - Guard de Protección por Roles
 * 
 * Este guard se encarga de proteger rutas verificando que el usuario
 * tenga el rol adecuado para acceder a un endpoint específico.
 * 
 * Ejemplo de uso:
 * @UseGuards(RolesGuard)
 * @Roles('admin', 'user')
 * async miEndpoint() { ... }
 * 
 * Este guard:
 * 1. Lee qué roles requiere el endpoint (del decorador @Roles)
 * 2. Verifica que el usuario esté autenticado
 * 3. Verifica que el usuario tenga uno de los roles permitidos
 * 4. Permite o deniega el acceso
 */

import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * @Injectable() - Marca esta clase como un provider que puede ser inyectado
 */
@Injectable()
export class RolesGuard implements CanActivate {
    // Logger para registrar intentos de acceso
    private readonly logger = new Logger('RolesGuard');

    /**
     * Constructor
     * @param reflector - Servicio de NestJS que permite leer metadata
     *                    (en este caso, los roles del decorador @Roles)
     */
    constructor(private reflector: Reflector) { }

    /**
     * Método principal que determina si se permite el acceso
     * 
     * @param context - Contexto de ejecución que contiene información
     *                  sobre la petición HTTP y el handler
     * @returns true si se permite el acceso, lanza excepción si no
     */
    canActivate(context: ExecutionContext): boolean {
        // ============================================
        // PASO 1: Obtener roles requeridos del endpoint
        // ============================================
        /**
         * Usar Reflector para leer los roles definidos con @Roles('admin', 'user')
         * Si no hay roles definidos, permitir el acceso (ruta pública)
         */
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) {
            // No hay restricción de roles, permitir acceso
            return true;
        }

        // ============================================
        // PASO 2: Obtener el objeto request (petición HTTP)
        // ============================================
        const request = context.switchToHttp().getRequest();
        const user = request.user; // El usuario debe haber sido agregado por otro guard/middleware

        // ============================================
        // PASO 3: Validar que el usuario existe (está autenticado)
        // ============================================
        /**
         * Si no hay usuario en el request, significa que no pasó
         * por autenticación previa
         */
        if (!user) {
            this.logger.warn('Acceso denegado: Usuario no autenticado');
            throw new UnauthorizedException('Usuario no autenticado');
        }

        // ============================================
        // PASO 4: Validar que el usuario tiene un rol asignado
        // ============================================
        if (!user.rol) {
            this.logger.warn(`Usuario ${user.id} no tiene rol asignado`);
            throw new ForbiddenException('Usuario sin rol asignado');
        }

        // ============================================
        // PASO 5: Verificar si el rol del usuario está permitido
        // ============================================
        /**
         * Compara el rol del usuario con la lista de roles permitidos
         * Ejemplo: usuario.rol = 'admin'
         *          requiredRoles = ['admin', 'user']
         *          hasRole = true (admin está en la lista)
         */
        const hasRole = requiredRoles.includes(user.rol);

        if (!hasRole) {
            // El usuario NO tiene permiso
            this.logger.warn(
                `Usuario ${user.id} con rol "${user.rol}" intentó acceder a recurso que requiere roles: ${requiredRoles.join(', ')}`,
            );
            throw new ForbiddenException(
                `Acceso denegado. Se requieren los siguientes roles: ${requiredRoles.join(', ')}`,
            );
        }

        // ============================================
        // PASO 6: Acceso concedido
        // ============================================
        this.logger.debug(`Usuario ${user.id} con rol "${user.rol}" autorizado`);
        return true; // Permitir acceso
    }
}
