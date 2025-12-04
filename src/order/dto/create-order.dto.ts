import { IsNumber, IsEnum, Min, isNumber, IsOptional } from "class-validator";
import { OrderStatus } from "../entities/order.entity";

export class CreateOrderDto {
    @IsNumber()
    productId: number;

    @IsNumber()
    clientId: number;

    @IsNumber()
    createdById: number;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0)
    total: number;

    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;
}