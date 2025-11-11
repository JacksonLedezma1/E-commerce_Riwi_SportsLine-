import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente.entity';

@Controller('clientes')
export class ClienteController {
    constructor(private readonly clienteService: ClienteService) {}

    @Post()
    async crearCliente(
        @Body() dto: CreateClienteDto,
    ): Promise<Cliente> {
        return await this.clienteService.crearCliente(dto);
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
        @Body() dto: UpdateClienteDto,
    ): Promise<Cliente | null> {
        return await this.clienteService.actualizarCliente(id,dto);
    }

    @Delete(':id')
    async eliminarCliente(@Param('id') id: number): Promise<{ mensaje: string }> {
        await this.clienteService.eliminarCliente(id);
        return { mensaje: `Usuario con id ${id} eliminado correctamente` };
    }
}
