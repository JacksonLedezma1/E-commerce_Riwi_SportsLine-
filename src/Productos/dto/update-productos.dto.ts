import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductoDto {
    @IsOptional()
    @IsString({ message: 'El nombre del producto debe ser una cadena de texto' })
    nombre?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'El precio debe ser un número' })
    @IsPositive({ message: 'El precio debe ser mayor que cero' })
    precio?: number;
}