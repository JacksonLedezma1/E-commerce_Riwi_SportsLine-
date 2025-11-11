import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { Client } from "src/client/entities/client.entity";
import { baseEntity } from "src/shared/base.entity";
import { User } from "src/users/entities/user.entity";

@Entity('orders')
export class Order extends baseEntity{
    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column('int', { default: 1 })
    quantity: number;
    /* 
    FALTA AGREGAR
    estado del pedido (pendiente, enviado, entregado, cancelado)
    */

    @ManyToOne(() => Product, (product) => product.orders, { onDelete: 'CASCADE' })
    @JoinColumn({name: 'product_id'})
    product: Product;

    @ManyToOne(() => Client, (client) => client.orders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
    client: Client;

    @ManyToOne(() => User, (user) => user.ordersCreated, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'created_by' })
    createdBy: User;
}