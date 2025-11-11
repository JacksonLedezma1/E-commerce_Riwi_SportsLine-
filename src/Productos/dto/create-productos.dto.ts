import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductoDto {
    @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
    nombre: string;

    @IsNumber({}, { message: 'El precio debe ser un número' })
    @IsPositive({ message: 'El precio debe ser mayor que 0' })
    @Type(() => Number)
    precio: number;
}