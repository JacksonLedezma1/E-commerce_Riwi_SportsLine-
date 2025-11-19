import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user; // Suponiendo que llega autenticado

        if (!user || !requiredRoles.includes(user.rol)) {
            throw new ForbiddenException('No tienes permiso para acceder a este recurso');
        }

        return true;
    }
}
