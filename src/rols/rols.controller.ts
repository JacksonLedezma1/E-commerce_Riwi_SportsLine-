import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RolsService } from './rols.service';
import { PermissionService } from './permissions.service';

@Controller('rols')
export class RolsController {
    constructor(
        private readonly rolsService: RolsService,
        private readonly permsService: PermissionService,
    ){}

    //Crear rol
    @Post()
    createRole(@Body('name') name: string){
        return this.rolsService.createRole(name);
    }

    //Listar roles
    @Get()
    findAllRoles(){
        return this.rolsService.findAll();
    }

    //Crear permiso
    @Post('permissions')
    createPermission(@Body('name') name: string){
        return this.permsService.createPermission(name);
    }

    //Listar permisos
    @Get('permissions')
    findAllPermissions(){
        return this.permsService.findAll();
    }

    //Asignar permiso a rol
    @Post(':roleId/permissions/:permissionId')
    assign(
        @Param('roleId') roleId: number,
        @Param('permissionId') permissionId: number
    ){
        return this.rolsService.assignPermission(roleId, permissionId);
    }
}
