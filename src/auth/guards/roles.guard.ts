import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    canActivate(ctx: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(
            ROLES_KEY,[ctx.getHandler(), ctx.getClass()]
        );

        if (!requiredRoles) return true;

        const { user } = ctx.switchToHttp().getRequest();
        if (!requiredRoles.includes(user.role?.name)){
            throw new ForbiddenException('No tienes el rol necesario.')
        }

        return true;
    }
}