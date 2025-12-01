import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefrehToken } from './dto/refresh-token.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwt: JwtService,
    ) {}

    //LOGIN -> verifica user + genera tokens

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Credenciales Invalidas');

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) throw new UnauthorizedException('Credenciales invalid');

        const tokens = await this.generateTokens(user);

        //Guarda el refresh token hasehado en BD
        await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }
    
    //GENERAR ACCESS + REFRESH TOKEN

    async generateTokens(user: any){
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role?.name,
        };
        
        const accessToken = this.jwt.sign(payload,{
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });

        const refreshToken = this.jwt.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '7d',
        });

        return { accessToken, refreshToken };
    }

    //REFRESH
    async refresh(refreshToken: string, user, any){
        const storedToken = await this.usersService.getRefreshToken(user.sub);

        //Comparamos tokens de manera segura
        const tokenIsValid = await bcrypt.compare(refreshToken, storedToken);
        if (!tokenIsValid) throw new UnauthorizedException('Refresh token Invalido');

        const tokens = await this.generateTokens(user);
        await this.usersService.updateRefreshToken(user.sub, tokenIsValid.refreshToken);
        return tokens;
    }

    //LOGOUT
    async logout(userId: string){
        return this.usersService.deleteRefreshToken(userId);
    }

    //REGISTER
    async register(data: any){
        const hashedPass = await bcrypt.hash(data.password, 10);
        return this.usersService.createUser({
            ...data, password: hashedPass
        })
    }
}
