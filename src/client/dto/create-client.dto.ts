import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateClientDto {
    @IsString()
    name: string;

    @IsNumber()
    phone: number;

    @IsEmail()
    email: string;
    
    @IsString()
    address: string;
}