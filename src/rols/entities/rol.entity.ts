import { Permission } from "src/rols/entities/permission.entity";
import { baseEntity } from "src/shared/base.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToOne, OneToMany } from "typeorm";

@Entity('roles')
export class Role extends baseEntity {
    @Column({ unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.role)
    users: User[];

    @ManyToOne(() => Permission, (perm) => perm.roles)
    @JoinTable ({
        name: 'role_permissions',
        joinColumn: { name: 'role_id' },
        inverseJoinColumn: { name: 'permission_id'},
    })
    permissions: Permission[]
}