import {Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Column} from 'typeorm';
import { Usuario } from '../Usuarios/usuario.entity';
import { Cliente } from '../Clientes/cliente.entity';
import { Producto } from '../Productos/producto.entity';

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    estado: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.pedidos)
    usuario: Usuario;

    @ManyToOne(() => Cliente, (cliente) => cliente.pedidos)
    cliente: Cliente;

    @ManyToMany(() => Producto, (producto) => producto.pedidos)
    @JoinTable()
    productos: Producto[];
}
