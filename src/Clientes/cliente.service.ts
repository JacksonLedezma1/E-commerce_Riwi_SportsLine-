import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './cliente.entity';

@Injectable()
export class ClienteService {
    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
    ) {}

    async crearCliente(nombre: string, direccion: string): Promise<Cliente> {
        const nuevo = this.clienteRepository.create({ nombre, direccion });
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

    async actualizarCliente(id: number, datos: Partial<Cliente>): Promise<Cliente | null> {
        await this.clienteRepository.update(id, datos);
        return await this.obtenerClientePorId(id);
    }

    async eliminarCliente(id: number): Promise<void> {
        await this.clienteRepository.delete(id);
    }
}
