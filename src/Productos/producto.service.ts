import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from "./producto.entity";

@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) {}

    async crearProducto(nombre: string, precio: number): Promise<Producto> {
        const nuevoProducto = this.productoRepository.create({ nombre, precio});
        return await this.productoRepository.save(nuevoProducto);
    }

    async obtenerProductos(): Promise<Producto[]> {
        return await this.productoRepository.find();
    }

    async obtenerProductosPorId(id: number): Promise<Producto | null> {
        return await this.productoRepository.findOneBy({ id });
    }

    async eliminarProducto(id: number): Promise<void> {
        await this.productoRepository.delete(id);
    }

    async actualizarProducto(id: number, datos: Partial<Producto>): Promise<Producto | null> {
        await this.productoRepository.update(id, datos);
        return this.obtenerProductosPorId(id);
    }
}
