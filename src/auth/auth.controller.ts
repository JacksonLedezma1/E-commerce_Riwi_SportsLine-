import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { RefreshToken } from './dto/refresh-token.dto';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // LOGIN
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    // REFRESH TOKEN
    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    refresh(
        @Body() dto: RefreshToken,
        @GetUser() user: any
    ) {
        return this.authService.refresh(dto.refreshToken, user);
    }

    // LOGOUT
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@GetUser() user: any) {
        return this.authService.logout(user.sub);
    }

    // REGISTER
    @Post('register')
    register(@Body() body: any) {
        return this.authService.register(body);
    }
}
