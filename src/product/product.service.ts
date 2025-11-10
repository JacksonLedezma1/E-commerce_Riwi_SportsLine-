import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
    // Business logic for product management will go
    private products: Product[] = [];

    createProduct(createProductDto: CreateProductDto) {
        const newProduct: Product = {
            id: this.products.length + 1,
            ...createProductDto,
            orders: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.products.push(newProduct);
        return newProduct;
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id: number){
        const product = this.products.find((p) => p.id === id);
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    updateProduct(id: number, updateData: Partial<CreateProductDto>){
        const product = this.getProductById(id);
        if (product) {
            Object.assign(product, updateData);
        }
        return product;
    }

    deleteProduct(id: number): boolean {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            return true;
        }
        return false;
    }
}
