import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePedidoDto {
    @IsInt({ message: 'El ID del cliente debe ser un número entero' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
    clienteId: number;

    @IsInt({ message: 'El ID del usuario debe ser un número entero' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    usuarioId: number;

    @IsArray({ message: 'Los productos deben enviarse como un arreglo de IDs' })
    @IsInt({ each: true, message: 'Cada ID de producto debe ser un número entero' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'Debe incluir al menos un producto' })
    productosIds: number[];

    @IsOptional()
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    estado?: string='pendiente';
}
