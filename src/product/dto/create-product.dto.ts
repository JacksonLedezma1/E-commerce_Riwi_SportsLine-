import { IsString, IsNumber, IsOptional, IsPositive, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @IsString()
    @MinLength(10)
    description: string;

    @IsNumber()
    @IsPositive({ message: 'Price must be a positive number' })
    price: number;

    @IsOptional()
    @IsNumber()
    stock?: number;
}