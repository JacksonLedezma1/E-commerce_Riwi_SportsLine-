import { Entity, Column, OneToMany } from "typeorm";
import { baseEntity } from "src/shared/base.entity";
import { Order } from "src/order/entities/order.entity";

@Entity('clients')
export class Client extends baseEntity{
    @Column({ length: 100 })
    name: string;

    @Column()
    phone: number;

    @Column({ length: 150 })
    email: string;

    @Column({ length: 150 })
    address: string

    @OneToMany(() => Order, (order) => order.client)
    order: Order[]
}