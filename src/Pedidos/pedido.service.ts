import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Pedido } from './pedido.entity';
import { Cliente } from '../Clientes/cliente.entity';
import { Usuario } from '../Usuarios/usuario.entity';
import { Producto } from '../Productos/producto.entity';
import { CreatePedidoDto } from './dto/create-pedidos.dto';
import { UpdatePedidoDto } from './dto/update-pedidos.dto';

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
    async crearPedido(dto: CreatePedidoDto): Promise<Pedido> {
        const { clienteId, usuarioId, productosIds, estado } = dto;

        const cliente = await this.clienteRepository.findOneBy({ id: clienteId });
        if (!cliente) throw new NotFoundException('Cliente no encontrado');

        const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
        if (!usuario) throw new NotFoundException('Usuario no encontrado');

        const productos = await this.productoRepository.findBy({ id: In(productosIds) });
        if (!productos || productos.length === 0)
            throw new NotFoundException('Productos no encontrados');

        const nuevoPedido = this.pedidoRepository.create(dto);

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
        if (!pedido) throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
        return pedido;
    }

    // Actualizar estado o datos del pedido
    async actualizarPedido(id: number, dto: UpdatePedidoDto): Promise<Pedido> {
        const pedido = await this.obtenerPedidoPorId(id);

        if (dto.estado) pedido.estado = dto.estado;
        if (dto.productosIds && dto.productosIds.length > 0) {
            const productos = await this.productoRepository.findBy({
                id: In(dto.productosIds),
            });
            if (productos.length === 0)
                throw new BadRequestException('Los productos enviados no existen');
            pedido.productos = productos;
        }

        return this.pedidoRepository.save(pedido);
    }

    // Eliminar pedido
    async eliminarPedido(id: number): Promise<void> {
        const pedido = await this.pedidoRepository.findOneBy({ id });
        if (!pedido) throw new NotFoundException('El pedido no existe');
        await this.pedidoRepository.remove(pedido);
    }
}

