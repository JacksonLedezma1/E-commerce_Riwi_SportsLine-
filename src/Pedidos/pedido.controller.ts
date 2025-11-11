import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe  } from '@nestjs/common';
import { PedidosService } from './pedido.service';
import { Pedido } from './pedido.entity';
import { CreatePedidoDto } from './dto/create-pedidos.dto';
import { UpdatePedidoDto } from './dto/update-pedidos.dto';

@Controller('pedidos')
export class PedidosController {
    constructor(private readonly pedidosService: PedidosService) {}

    @Post()
    async crearPedido(@Body() dto: CreatePedidoDto) {
        return this.pedidosService.crearPedido(dto);
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
    async actualizarPedido(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePedidoDto,
    ) {
        return this.pedidosService.actualizarPedido(id, dto);
    }

    // Eliminar pedido
    @Delete(':id')
    async eliminarPedido(@Param('id') id: number): Promise<{ mensaje: string }> {
        await this.pedidosService.eliminarPedido(Number(id));
        return { mensaje: `Pedido con ID ${id} eliminado correctamente` };
    }
}
