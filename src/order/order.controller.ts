import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Roles('admin', 'seller')
    @Post()
    createOrder(@Body() dto: CreateOrderDto) {
        return this.orderService.createOrder(dto);
    }

    @Get()
    getAllOrders() {
        return this.orderService.findAllOrders();
    }

    @Get(':id')
    getOrderById(@Param('id') id: number) {
        return this.orderService.findOrderById(id);
    }

    @Roles('admin', 'seller')
    @Put(':id')
    updateOrder(@Param('id') id: number, @Body() dto: UpdateOrderDto) {
        return this.orderService.updateOrder(id, dto);
    }

    @Delete(':id')
    deleteOrder(@Param('id') id: number) {
        return this.orderService.deleteOrder(id);
    }
}
