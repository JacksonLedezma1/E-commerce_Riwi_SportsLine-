import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAuthGuard } from './guards/refresh.guard';
import { RefreshToken } from './dto/refresh-token.dto';
import { GetUser } from './decorators/get-user.decorator';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // LOGIN
    @ApiOperation({ summary: 'Iniciar sesion y obtener tokens' })
    @ApiBody({ type: LoginDto })
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    // REFRESH TOKEN
    @ApiBearerAuth('Access-token')
    @ApiOperation({ summary: 'Obtener nuevos tokens mediante refresh token' })
    @ApiBody({ type: RefreshToken })
    @UseGuards(RefreshAuthGuard)
    @Post('refresh')
    refresh(
        @Body() dto: RefreshToken,
        @GetUser() user: any
    ) {
        return this.authService.refresh(dto.refreshToken, user);
    }

    // LOGOUT
    @ApiBearerAuth('Access-token')
    @ApiOperation({ summary: 'Cerrar sesion y eliminar refresh token' })
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    logout(@GetUser() user: any) {
        return this.authService.logout(user.sub);
    }

    // REGISTER
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiBody({ schema: {
        example: {
            email: 'test@example.com',
            password: '123456',
            roleId: 1
        }
    }})
    @Post('register')
    register(@Body() body: any) {
        return this.authService.register(body);
    }
}
