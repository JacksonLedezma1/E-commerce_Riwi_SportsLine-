import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PedidosService } from './pedido.service';
import { Pedido } from './pedido.entity';

@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) {}

    @Post()
    async crearPedido(
        @Body('usuarioId') usuarioId: number,
        @Body('clienteId') clienteId: number,
        @Body('productosIds') productosIds: number[],
    ) {
        return this.pedidosService.crearPedido(usuarioId, clienteId, productosIds);
    }

    @Get()
    async obtenerPedidos() {
        return this.pedidosService.obtenerPedidos();
    }

    @Get(':id')
    async obtenerPedidoPorId(@Param('id') id: number) {
        return this.pedidosService.obtenerPedidoPorId(id);
    }

    // Actualizar estado del pedido
    @Put(':id')
    async actualizarEstado(
        @Param('id') id: number,
        @Body('estado') estado: string,
    ): Promise<Pedido> {
        return this.pedidosService.actualizarEstado(Number(id), estado);
    }

    // Eliminar pedido
    @Delete(':id')
    async eliminarPedido(@Param('id') id: number): Promise<{ mensaje: string }> {
        await this.pedidosService.eliminarPedido(Number(id));
        return { mensaje: `Pedido con ID ${id} eliminado correctamente` };
    }
}
