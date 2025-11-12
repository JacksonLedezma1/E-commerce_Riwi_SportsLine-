import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly ProductService: ProductService) {}
    
    @Post()
    createProduct(@Body() dto: CreateProductDto) {
        return this.ProductService.createProduct(dto);
    }

    @Get()
    getAllProducts() {
        return this.ProductService.getAllProducts();
    }

    @Get(':id')
    getProductById(@Param('id') id: number) {
        return this.ProductService.getProductById(id);
    }

    @Put(':id')
    updateProduct(@Param('id') id: number,  @Body() dto: UpdateProductDto) {
        return this.ProductService.updateProduct(id, dto);
    }

    @Delete(':id')
    removeProduct(@Param('id') id: number) {
        return this.ProductService.removeProduct(id);
    }
}
