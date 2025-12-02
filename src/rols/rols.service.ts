import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/rol.entity';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RolsService {
    constructor(
        @InjectRepository(Role)
        private readonly rolRepo: Repository<Role>,

        @InjectRepository(Permission)
        private readonly permRepo: Repository<Permission>,
    ) {}

    async createRole(name: string){
        const role = this.rolRepo.create({name});
        return this.rolRepo.save(role);
    }

    async findAll(){
        return this.rolRepo.find({relations: ['permissions']});
    }

    async findById(id: number){
        const role = await this.rolRepo.findOne({
            where: {id},
            relations: ['permissions'],
        });
        if(!role) throw new NotFoundException('Rol no encontrado');
        return role;
    }

    async assignPermission(roleId: number, permissionId: number){
        const role = await this.findById(roleId);
        const perm = await this.permRepo.findOneBy({id: permissionId});
        if(!perm) throw new NotFoundException('Permiso no encontrado');

        role.permissions = [...(role.permissions || []), perm];
        return this.rolRepo.save(role);
    }
}
