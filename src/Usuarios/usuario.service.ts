import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entitie';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async crearUsuario(nombre: string, correo: string, contrasena: string): Promise<Usuario> {
        const nuevoUsuario = this.usuarioRepository.create({ nombre, correo, contrasena });
        return await this.usuarioRepository.save(nuevoUsuario);
    }

    async obtenerUsuarios(): Promise<Usuario[]> {
        return await this.usuarioRepository.find();
    }

    async obtenerUsuarioPorId(id: number): Promise<Usuario | null> {
        return await this.usuarioRepository.findOneBy({ id });
    }

    async eliminarUsuario(id: number): Promise<void> {
        await this.usuarioRepository.delete(id);
    }

    async actualizarUsuario(id: number, datos: Partial<Usuario>): Promise<Usuario | null> {
        await this.usuarioRepository.update(id, datos);
        return this.obtenerUsuarioPorId(id);
    }
}
