import { IsString, Length } from 'class-validator';

export class CreateClienteDto {
    @IsString({message: 'El nombre debe ser un texto válido'})
    @Length(3, 50, {message: 'El nombre debe tener entre 2 y 50 caracteres'})
    nombre: string;

    @IsString({message: 'La direccion debe ser un texto válido'})
    @Length(5, 100,{message: 'la direccion debe tener entre 5 y 100 caracteres'})
    direccion: string;
}
