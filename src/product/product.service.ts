import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>
    ){}

    async createProduct(data: CreateProductDto): Promise<Product>{
        const newProduct = this.productRepo.create(data);
        return this.productRepo.save(newProduct);
    }

    async getAllProducts(): Promise<Product[]>{
        return this.productRepo.find({ relations: ['orders'] });
    }

    async getProductById(id: number): Promise<Product> {
        const product = await this.productRepo.findOne({ where: {id}, relations: ['orders']});
        if (!product) throw new NotFoundException (`Producto con ID ${id} no encontrado`);
        return product;
    }

    async updateProduct(id: number, data: Partial<UpdateProductDto>): Promise<Product> {
        const product = await this.getProductById(id);
        this.productRepo.merge(product, data);
        return this.productRepo.save(product);
    }

    async removeProduct(id: number): Promise<void> {
        const product = await this.getProductById(id);
        await this.productRepo.delete(product)
    }
}
