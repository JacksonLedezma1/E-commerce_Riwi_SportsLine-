import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.entity';

@Controller('clientes')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) {}

    @Post()
    async crearCliente(
        @Body('nombre') nombre: string,
        @Body('direccion') direccion: string,
    ): Promise<Cliente> {
        return await this.clienteService.crearCliente(nombre, direccion);
    }

    @Get()
    async obtenerClientes(): Promise<Cliente[]> {
        return await this.clienteService.obtenerClientes();
    }

    @Get(':id')
    async obtenerClientePorId(@Param('id') id: number): Promise<Cliente | null> {
        return await this.clienteService.obtenerClientePorId(id);
    }

    @Put(':id')
    async actualizarCliente(
        @Param('id') id: number,
        @Body() datos: Partial<Cliente>,
    ): Promise<Cliente | null> {
        return await this.clienteService.actualizarCliente(id, datos);
    }

    @Delete(':id')
    async eliminarCliente(@Param('id') id: number): Promise<void> {
        return await this.clienteService.eliminarCliente(id);
    }
}
