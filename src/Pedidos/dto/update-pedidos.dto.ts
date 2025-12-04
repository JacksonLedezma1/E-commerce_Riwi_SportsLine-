import { IsOptional, IsString,IsArray } from 'class-validator';

export class UpdatePedidoDto {
    @IsOptional()
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    estado?: string;

    @IsOptional()
    @IsArray({ message: 'El producto debe ser separado por ,' })
    productosIds?: number[];
}
