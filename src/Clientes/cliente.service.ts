import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
    ) {}

    async crearCliente(dto: CreateClienteDto): Promise<Cliente> {
        const nuevo = this.clienteRepository.create(dto);
        return await this.clienteRepository.save(nuevo);
    }

    async obtenerClientes(): Promise<Cliente[]> {
        return await this.clienteRepository.find({ relations: ['pedidos'] });
    }

    async obtenerClientePorId(id: number): Promise<Cliente | null> {
        return await this.clienteRepository.findOne({
            where: { id },
            relations: ['pedidos'],
        });
    }

    async actualizarCliente(id: number, dto: UpdateClienteDto): Promise<Cliente | null> {
        await this.clienteRepository.update(id, dto);
        return await this.obtenerClientePorId(id);
    }

    async eliminarCliente(id: number): Promise<void> {
        await this.clienteRepository.delete(id);
    }
}
