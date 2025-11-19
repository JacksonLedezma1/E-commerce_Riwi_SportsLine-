import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger('RolesGuard');
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Validar que el usuario existe
        if (!user) {
            this.logger.warn('Acceso denegado: Usuario no autenticado');
            throw new UnauthorizedException('Usuario no autenticado');
        }

        // Validar que el usuario tiene un rol
        if (!user.rol) {
            this.logger.warn(`Usuario ${user.id} no tiene rol asignado`);
            throw new ForbiddenException('Usuario sin rol asignado');
        }

        // Validar que el rol está en la lista de roles permitidos
        const hasRole = requiredRoles.includes(user.rol);
        if (!hasRole) {
            this.logger.warn(
                `Usuario ${user.id} con rol "${user.rol}" intentó acceder a recurso que requiere roles: ${requiredRoles.join(', ')}`,
            );
            throw new ForbiddenException(
                `Acceso denegado. Se requieren los siguientes roles: ${requiredRoles.join(', ')}`,
            );
        }

        this.logger.debug(`Usuario ${user.id} con rol "${user.rol}" autorizado`);
        return true;
    }
}
