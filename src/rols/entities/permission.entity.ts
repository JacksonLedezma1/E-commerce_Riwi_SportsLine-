import { Role } from "src/rols/entities/rol.entity";
import { baseEntity } from "src/shared/base.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('permissions')
export class Permission extends baseEntity {
    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

    @OneToMany(() => Role, (role) => role.permissions)
    roles: Role[]
    //Un permiso puede pertenecer a varios roles
}