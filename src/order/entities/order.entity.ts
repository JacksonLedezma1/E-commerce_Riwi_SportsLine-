import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { Client } from "src/client/entities/client.entity";
import { baseEntity } from "src/shared/base.entity";
import { User } from "src/users/entities/user.entity";

@Entity('orders')
export class Order extends baseEntity{
    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @ManyToOne(() => Product, (product) => product.order, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'product_id'})
    product: Product[];

    @ManyToOne(() => Client, (client) => client.order, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: Client[];

    @ManyToOne(() => User, (user) => user.createdBy, { onDelete: 'CASCADE' })
    createdBy: User[];
}