import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "../decorators/permissions.decorator";


@Injectable()
export class PermissionGuard implements CanActivate{
    constructor(private reflector: Reflector) {}

    canActivate(ctx: ExecutionContext): boolean{
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
            PERMISSIONS_KEY,
            [ctx.getHandler(), ctx.getClass()]
        );

        if (!requiredPermissions) return true;

        const { user } = ctx.switchToHttp().getRequest();

        const userPermissions = user.role?.rolePermissions?.map(
            p => p.action
        ) ?? [];

        const hasAll = requiredPermissions.every(p => userPermissions.includes(p))
        if (!hasAll){
            throw new ForbiddenException ('No tienes permisos suficientes')
        }

        return true;
    }
}