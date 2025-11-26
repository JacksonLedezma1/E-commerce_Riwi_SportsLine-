import { baseEntity } from "src/shared/base.entity";
import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Role } from "./rol.entity";
import { Permission } from "./permission.entity";

@Entity('role_permissions')
export class RolePermission extends baseEntity{

    @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => Permission
    , (permission) => permission.roles, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;
}