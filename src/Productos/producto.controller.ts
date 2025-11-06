import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from "./producto.entity";

@Controller('Producto')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) {}

    // Crear producto
    @Post()
    async crear(@Body() datos: { nombre: string; precio: number }): Promise<Producto> {
        return this.productoService.crearProducto(datos.nombre, datos.precio);
    }

    // Listar todos los producto
    @Get()
    async obtenerTodos(): Promise<Producto[]> {
        return this.productoService.obtenerProductos();
    }

    // Obtener producto por id
    @Get(':id')
    async obtenerPorId(@Param('id') id: number): Promise<Producto | null> {
        return this.productoService.obtenerProductosPorId(id);
    }

    // Actualizar producto
    @Put(':id')
    async actualizar(
        @Param('id') id: number,
        @Body() datos: Partial<Producto>,
    ): Promise<Producto | null> {
        return this.productoService.actualizarProducto(id, datos);
    }

    // Eliminar producto
    @Delete(':id')
    async eliminar(@Param('id') id: number): Promise<{ mensaje: string }> {
        await this.productoService.eliminarProducto(id);
        return { mensaje: `Usuario con id ${id} eliminado correctamente` };
    }
}
