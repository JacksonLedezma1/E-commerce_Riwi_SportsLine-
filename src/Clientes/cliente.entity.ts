import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from '../Pedidos/pedido.entity';

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    direccion: string;

    @OneToMany(() => Pedido, (pedido) => pedido.cliente)
    pedidos: Pedido[];
}
