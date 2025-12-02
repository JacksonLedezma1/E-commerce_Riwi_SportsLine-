import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwt: JwtService,
    ) {}

    // REFRESH TOKEN BD OPERATIONS
    // Guarda refresh token encriptado en BD
    async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
        const hashedToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateUser(userId, { refreshToken: hashedToken });
    }

    // Elimina refresh token (logout)
    async deleteRefreshToken(userId: number): Promise<void> {
        await this.usersService.updateUser(userId, {
            refreshToken: undefined,
        });
    }

    // Obtiene refresh token en BD
    async getRefreshToken(userId: number): Promise<string | null> {
        const user = await this.usersService.findUserById(userId);
        return user?.refreshToken || null;
    }

    // LOGIN

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) throw new UnauthorizedException('Credenciales inválidas');

        const tokens = await this.generateTokens(user);

        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    // GENERACIÓN DE TOKENS
    async generateTokens(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role?.name,
            permissions: user.role?.permissions?.map(p => p.name),
        };

        const access_token = this.jwt.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '15m',
        });

        // Solo lleva ID → seguridad++
        const refresh_token = this.jwt.sign(
            { sub: user.id },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            }
        );

        return { access_token, refresh_token };
    }

    // REFRESH TOKEN FLOW

    async refresh(refreshToken: string, user: any) {
        const storedToken = await this.getRefreshToken(user.sub);

        if (!storedToken) {
            throw new UnauthorizedException('Refresh token inválido');
        }

        const tokenIsValid = await bcrypt.compare(refreshToken, storedToken);
        if (!tokenIsValid) {
            throw new UnauthorizedException('Refresh token inválido');
        }

        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.sub, tokens.refresh_token);

        return tokens;
    }

    // LOGOUT

    async logout(userId: number) {
        return this.deleteRefreshToken(userId);
    }

    // REGISTER

    async register(data: any) {
        const hashedPass = await bcrypt.hash(data.password, 10);
        return this.usersService.createUser({
            ...data,
            password: hashedPass,
        });
    }
}
