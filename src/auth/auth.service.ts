import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepo: Repository<User>,
    ){}

    async Login(user: User){
        const payload = { sub: user.id, email: user.email, role: user.role.name };

        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '15m',
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: '15m',
        });

        await this.userRepo.update(user.id, {
            refreshTokenHash: await bcrypt.hash(refreshToken, 10),
        });

        return { accessToken, refreshToken };
    }

    async refreshToken(userId: number, refreshToken: string){
        const user = await this.userRepo.findOne({ where: { id: userId } });

        if (!user?.refreshTokenHash) throw new UnauthorizedException();
        
        const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);

        if (!match) throw new UnauthorizedException();

        return this.Login(user);

    }
}
