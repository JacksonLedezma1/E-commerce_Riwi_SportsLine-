import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}