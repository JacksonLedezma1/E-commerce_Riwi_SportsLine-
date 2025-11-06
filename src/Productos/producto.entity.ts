import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Pedido } from '../Pedidos/pedido.entity';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column('decimal')
    precio: number;

    @ManyToMany(() => Pedido, (pedido) => pedido.productos)
    pedidos: Pedido[];
}
