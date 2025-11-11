import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Pedido } from '../Pedidos/pedido.entity';

@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ unique: true })
    correo: string;

    @Column()
    contrasena: string;

    @OneToMany(() => Pedido, (pedido) => pedido.usuario)
    pedidos: Pedido[];
}
