import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/client/entities/client.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    // Order service methods would go here
    constructor(
        @InjectRepository(Order) private readonly orderRepo: Repository<Order>,  
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Client) private readonly clientRepo: Repository<Client>,
    ) {}

    async createOrder(orderData: CreateOrderDto): Promise<Order> {
        const product = await this.productRepo.findOneBy({ id: orderData.productId });
        if (!product) {
            throw new Error('Product not found');
        }
        const client = await this.clientRepo.findOneBy({ id: orderData.clientId });
        if (!client) {
            throw new Error('Client not found');
        }
        const user = await this.userRepo.findOneBy({ id: orderData.createdById });
        if (!user) {
            throw new Error('User not found');
        }
        
        const order = this.orderRepo.create({
            product,
            client,
            createdBy: user,
            quantity: orderData.quantity,
            total: orderData.total,
            status: orderData.status || OrderStatus.PENDING,
        });

        return this.orderRepo.save(order);
    }

    async findAllOrders(): Promise<Order[]> {
        return this.orderRepo.find({ relations: ['product', 'client', 'createdBy'], order: { createdAt: 'DESC' } });
    }

    async findOrderById(id: number): Promise<Order> {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['product', 'client', 'createdBy'],
        });
        if (!order) {
            throw new Error('Order not found');
        }
        return order;
    }

    async updateOrder(id: number, updateData: Partial<Order>): Promise<Order> {
        const order = await this.findOrderById(id);
        Object.assign(order, updateData);
        return this.orderRepo.save(order);
    }

    async deleteOrder(id: number): Promise<void> {
        const result = await this.orderRepo.delete(id);
        if (result.affected === 0) {
            throw new Error('Order not found');
        }
    }

}
