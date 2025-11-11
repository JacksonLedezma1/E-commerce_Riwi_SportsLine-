import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from "./dto/create-usuarios.dto";
import { UpdateUsuarioDto } from "./dto/update-usuarios.dto";

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly usuarioRepository: Repository<Usuario>,
    ) {}

    async crearUsuario(dto:CreateUsuarioDto): Promise<Usuario> {
        const nuevoUsuario = this.usuarioRepository.create(dto);
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

    async actualizarUsuario(id: number, dto:UpdateUsuarioDto): Promise<Usuario | null> {
        await this.usuarioRepository.update(id, dto);
        return this.obtenerUsuarioPorId(id);
    }
}
