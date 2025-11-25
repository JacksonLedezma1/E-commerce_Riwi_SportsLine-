import { Role } from "src/rols/entities/rol.entity";
import { BaseEntity, Column, Entity, ManyToMany } from "typeorm";

@Entity('permissions')
export class Permission extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Role, (role) => role.permissions)
    roles: Role[]
}