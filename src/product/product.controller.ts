import { Body, Controller, Get, Post, Param, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('product')
export class ProductController {
    constructor(private readonly ProductService: ProductService) {}
    
    @Roles('admin')
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

    @Roles('admin')
    @Put(':id')
    updateProduct(@Param('id') id: number,  @Body() dto: UpdateProductDto) {
        return this.ProductService.updateProduct(id, dto);
    }

    @Roles('admin')
    @Delete(':id')
    removeProduct(@Param('id') id: number) {
        return this.ProductService.removeProduct(id);
    }
}
