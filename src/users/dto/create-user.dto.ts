import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from "class-validator";

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    password?: string | null;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}