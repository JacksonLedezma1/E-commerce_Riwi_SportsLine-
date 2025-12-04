import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './pedido.entity';
import { PedidosService } from './pedido.service';
import { PedidosController } from './pedido.controller';
import { Cliente } from '../Clientes/cliente.entity';
import { Usuario } from '../Usuarios/usuario.entity';
import { Producto } from '../Productos/producto.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Pedido, Cliente, Usuario, Producto]),
    ],
    providers: [PedidosService],
    controllers: [PedidosController],
    exports: [PedidosService],
})
export class PedidosModel {}
