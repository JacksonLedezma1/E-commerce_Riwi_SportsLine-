import { Role } from "src/rols/entities/rol.entity";
import { baseEntity } from "src/shared/base.entity";
import { Column, Entity, ManyToMany } from "typeorm";

@Entity('permissions')
export class Permission extends baseEntity {
    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[]
}