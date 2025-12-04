import { IsString, IsArray, IsOptional, IsDateString, ArrayNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApiKeyDto {
    @ApiProperty({
        description: 'Nombre descriptivo para la API key',
        example: 'Mi API Key de Producción',
        minLength: 3,
        maxLength: 100
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Permisos/scopes que tendrá la API key',
        example: ['read:products', 'write:products', 'read:orders'],
        type: [String],
        isArray: true
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    scopes: string[];

    @ApiPropertyOptional({
        description: 'Fecha de expiración de la API key (opcional)',
        example: '2025-12-31T23:59:59.000Z',
        type: String
    })
    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}
