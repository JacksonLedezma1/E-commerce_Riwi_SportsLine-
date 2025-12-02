import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { baseEntity } from "src/shared/base.entity";
import { Order } from "src/order/entities/order.entity";
import { Role } from "src/rols/entities/rol.entity";

@Entity('users')
export class User extends baseEntity{
    @Column({ length: 100 })
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => Order, (order) => order.createdBy)
    ordersCreated: Order[];

    @ManyToOne(() => Role, (role) => role.users, { eager: true })
    //El eager:true carga el rol automaticamente cuando obtienes el usuario
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Column({ nullable: true })
    refreshToken?: string;
}