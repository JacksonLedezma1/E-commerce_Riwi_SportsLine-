import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Cliente } from '../Clientes/cliente.entity';
import { Usuario } from '../Usuarios/usuario.entitie';
import { Producto } from '../Productos/producto.entity';

@Injectable()
export class PedidosService {
    constructor(
        @InjectRepository(Pedido)
        private readonly pedidoRepository: Repository<Pedido>,
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) {}

    // Crear un nuevo pedido
    async crearPedido(
        clienteId: number,
        usuarioId: number,
        productosIds: number[],
    ): Promise<Pedido> {
        const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
        const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
        const productos = await this.productoRepository.findBy({ id: In(productosIds) });

        if (!cliente) throw new NotFoundException('Cliente no encontrado');
        if (!usuario) throw new NotFoundException('Usuario no encontrado');
        if (productos.length === 0) throw new NotFoundException('Productos no encontrados');

        const nuevoPedido = this.pedidoRepository.create({
            cliente,
            usuario,
            productos,
            estado: 'pendiente',
        });

        return this.pedidoRepository.save(nuevoPedido);
    }

    // Obtener todos los pedidos
    async obtenerPedidos(): Promise<Pedido[]> {
        return this.pedidoRepository.find({
            relations: ['cliente', 'usuario', 'productos'],
        });
    }

    // Obtener pedido por ID
    async obtenerPedidoPorId(id: number): Promise<Pedido> {
        const pedido = await this.pedidoRepository.findOne({
            where: { id },
            relations: ['cliente', 'usuario', 'productos'],
        });
        if (!pedido) throw new Error(`No se encontró el pedido con ID ${id}`);
        return pedido;
    }

    // Actualizar estado del pedido
    async actualizarEstado(id: number, estado: string): Promise<Pedido> {
        const pedido = await this.obtenerPedidoPorId(id);
        pedido.estado = estado;
        return this.pedidoRepository.save(pedido);
    }

    // Eliminar pedido
    async eliminarPedido(id: number): Promise<void> {
        await this.pedidoRepository.delete(id);
    }
}
