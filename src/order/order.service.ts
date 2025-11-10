import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
    // Order service methods would go here
    constructor(
        @InjectRepository(Order)
        private readonly orderRepo: Repository<Order>    
    ) {}

    createOrder(orderData: any) {
        const order = this.orderRepo.create(orderData);
        return this.orderRepo.save(order);
    }
}
