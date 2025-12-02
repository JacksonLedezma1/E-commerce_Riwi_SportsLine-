import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";


@Injectable()
export class PermissionGuard implements CanActivate{
    constructor(private reflector: Reflector) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        //1. Buscar los permisos requeridos en el endpoint
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (!requiredPermissions) return true;

        //2. Obtener el usuario desde JWT
        const request = context.switchToHttp().getRequest();    
        const user = request.user;

        if (!user?.role?.permissions) {
            throw new ForbiddenException('Usuario no tiene permisos asignados');
        }

        //3. Lista de permisos del usuario
        const userPermissions = user.role.permissions.map((p) => p.name);

        //4. Verificar si el usuario tiene los permisos requeridos
        const hasPermission = requiredPermissions.every((permission) =>
            userPermissions.includes(permission),
        );
        
        if (!hasPermission) {
            throw new ForbiddenException('Usuario no tiene permisos para acceder a este recurso');
        }

        return true;
    }
}

/**
 * Lee los permisos desde el @Permissions()
 * Verifica si el usuario tiene los permisos requeridos
 * Lanza ForbiddenException si no tiene permisos
 */