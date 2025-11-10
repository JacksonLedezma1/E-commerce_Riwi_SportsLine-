import { Entity, Column, OneToMany } from "typeorm";
import { baseEntity } from "src/shared/base.entity";
import { Order } from "src/order/entities/order.entity";

@Entity('products')
export class Product extends baseEntity{
    @Column('varchar', { length: 150 })
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('int', { default: 0 })
    stock: number;

    @OneToMany(() => Order, (order) => order.product)
    orders: Order[]
}