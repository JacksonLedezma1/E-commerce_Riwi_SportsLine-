import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/client/entities/client.entity';
import { Product } from 'src/product/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Client, Product])],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [TypeOrmModule, OrderService]
})
export class OrderModule {}
