import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { Producto } from "./producto.entity";
import { CreateProductoDto } from './dto/create-productos.dto';
import { UpdateProductoDto } from './dto/update-productos.dto';

@Controller('Producto')
export class ProductoController {
    constructor(private readonly productoService: ProductoService) {}

    // Crear producto
    @Post()
    crearProducto(@Body() dto: CreateProductoDto) {
        return this.productoService.crearProducto(dto);
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
    actualizarProducto(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductoDto,
    ) {
        return this.productoService.actualizarProducto(id, dto);
    }

    // Eliminar producto
    @Delete(':id')
    async eliminar(@Param('id') id: number): Promise<{ mensaje: string }> {
        await this.productoService.eliminarProducto(id);
        return { mensaje: `Usuario con id ${id} eliminado correctamente` };
    }
}
