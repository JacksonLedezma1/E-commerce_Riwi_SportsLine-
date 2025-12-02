import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "./entities/permission.entity";
import { Repository } from "typeorm";

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permRepo: Repository<Permission>,
    ){}

    async createPermission(name: string){
        const perm = this.permRepo.create({name});
        return this.permRepo.save(perm);
    }

    async findAll(){
        return this.permRepo.find();
    }
}