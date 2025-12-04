import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsEmail()
    correo?: string;

    @IsOptional()
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    contrasena?: string;

    @IsOptional()
    @IsString()
    rol?: string;
}
