import { IsString } from "class-validator";

export class RefrehToken {
    @IsString()
    refreshToken: string;
}