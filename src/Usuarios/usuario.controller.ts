import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from "./dto/create-usuarios.dto";
import { UpdateUsuarioDto } from "./dto/update-usuarios.dto";

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    // Crear usuario
    @Post()
    async crear(@Body() dto: CreateUsuarioDto): Promise<Usuario> {
        return this.usuariosService.crearUsuario(dto);
    }

    // Listar todos los usuarios
    @Get()
    async obtenerTodos(): Promise<Usuario[]> {
        return this.usuariosService.obtenerUsuarios();
    }

    // Obtener usuario por id
    @Get(':id')
    async obtenerPorId(@Param('id') id: number): Promise<Usuario | null> {
        return this.usuariosService.obtenerUsuarioPorId(id);
    }

    // Actualizar usuario
    @Put(':id')
    async actualizar(
        @Param('id') id: number,
        @Body() dto: UpdateUsuarioDto,
    ): Promise<Usuario | null> {
        return this.usuariosService.actualizarUsuario(id, dto);
    }

    // Eliminar usuario
    @Delete(':id')
    async eliminar(@Param('id') id: number): Promise<{ mensaje: string }> {
        await this.usuariosService.eliminarUsuario(id);
        return { mensaje: `Usuario con id ${id} eliminado correctamente` };
    }
}
