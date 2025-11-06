import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './producto.entity';
import { ProductoService } from './producto.service';
import { ProductoController} from "./producto.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Producto])],
    providers: [ProductoService],
    controllers: [ProductoController],
    exports: [ProductoService], // importante para usarlo en otros módulos (como seeds)
})
export class ProductosModel {}
