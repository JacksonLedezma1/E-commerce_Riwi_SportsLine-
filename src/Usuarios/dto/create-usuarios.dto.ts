import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
    @IsString()
    nombre: string;

    @IsEmail()
    correo: string;

    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    contrasena: string;

    @IsOptional()
    @IsString()
    rol?: string = 'empleado';
}