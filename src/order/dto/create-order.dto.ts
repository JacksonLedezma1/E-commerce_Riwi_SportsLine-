import { IsNumber, IsPositive } from "class-validator";

export class CreateOrderDto {
    @IsNumber()
    @IsPositive({ message: 'Price must be a positive number' })
    total: number;

    @IsNumber()
    @IsPositive({ message: 'Quantity must be a positive number' })
    quantity: number;
}