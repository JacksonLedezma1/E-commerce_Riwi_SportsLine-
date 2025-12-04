import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //1. Leer los roles desde @Roles()
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,[context.getHandler(), context.getClass()],
        );
        //Si el endpoint no tiene roles, permitir acceso
        if (!requiredRoles) return true;

        //2. Obtener el usuario de la request
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if(!user?.role) {
            throw new ForbiddenException('Usuario no tiene rol asignado');
        }

        //3. Verificar si el rol del usuario esta en los roles permitidos
        const hasRole = requiredRoles.includes(user.role);
        if (!hasRole) {
            throw new ForbiddenException('Usuario no tiene permisos para acceder a este recurso');
        }

        return true;
    }
}

//Usa reflector para leer los roles del @Roles()
//Verifica si el rol del usuario esta en los roles permitidos
//Lanza ForbiddenException si no tiene permisos