import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { Usuario } from './usuario.entitie';

@Controller('usuarios')
export class UsuariosController {
    constructor(private readonly usuariosService: UsuariosService) {}

    // Crear usuario
    @Post()
    async crear(@Body() datos: { nombre: string; correo: string; contrasena:string }): Promise<Usuario> {
        return this.usuariosService.crearUsuario(datos.nombre, datos.correo, datos.contrasena);
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
        @Body() datos: Partial<Usuario>,
    ): Promise<Usuario | null> {
        return this.usuariosService.actualizarUsuario(id, datos);
    }

    // Eliminar usuario
    @Delete(':id')
    async eliminar(@Param('id') id: number): Promise<{ mensaje: string }> {
        await this.usuariosService.eliminarUsuario(id);
        return { mensaje: `Usuario con id ${id} eliminado correctamente` };
    }
}
