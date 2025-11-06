import { Entity, Column, OneToMany } from "typeorm";
import { baseEntity } from "src/shared/base.entity";
import { Order } from "src/order/entities/order.entity";

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
    createdBy: User[]
}