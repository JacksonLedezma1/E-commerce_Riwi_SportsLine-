import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
    Logger,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiSecurity } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger('AuthController');

    constructor(private authService: AuthService) { }

    /**
     * POST /auth/api-keys
     * Genera una nueva API key (requiere autenticación)
     */
    @Post('api-keys')
    @ApiOperation({
        summary: 'Generar nueva API Key',
        description: 'Crea una nueva API key para autenticación. Requiere estar autenticado como admin o user.'
    })
    @ApiSecurity('api-key')
    @ApiBody({ type: CreateApiKeyDto })
    @ApiResponse({
        status: 201,
        description: 'API Key generada exitosamente',
        schema: {
            example: {
                message: 'API Key generada exitosamente',
                apiKey: {
                    id: 1,
                    name: 'Mi API Key',
                    key: 'rsl_abcd1234...',
                    scopes: ['read:products', 'write:products'],
                    expiresAt: '2025-01-03T12:00:00.000Z',
                    createdAt: '2024-12-04T12:00:00.000Z'
                },
                warning: 'Guarda esta clave de forma segura. No se mostrará nuevamente.'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 403, description: 'Sin permisos' })
    @UseGuards(RolesGuard)
    @Roles('admin', 'user')
    async createApiKey(@Body() createApiKeyDto: CreateApiKeyDto, @Req() req: any) {
        const usuarioId = req.user?.id;
        const { apiKey, plainKey } = await this.authService.generateApiKey(
            createApiKeyDto,
            usuarioId,
        );

        this.logger.log(`API Key creada por usuario ${usuarioId}: ${apiKey.name}`);

        return {
            message: 'API Key generada exitosamente',
            apiKey: {
                id: apiKey.id,
                name: apiKey.name,
                key: plainKey, // Solo se muestra una vez
                scopes: apiKey.scopes,
                expiresAt: apiKey.expiresAt,
                createdAt: apiKey.createdAt,
            },
            warning: 'Guarda esta clave de forma segura. No se mostrará nuevamente.',
        };
    }

    /**
     * GET /auth/api-keys
     * Lista las API keys del usuario autenticado
     */
    @Get('api-keys')
    @ApiOperation({
        summary: 'Listar mis API Keys',
        description: 'Obtiene todas las API keys del usuario autenticado'
    })
    @ApiSecurity('api-key')
    @ApiResponse({ status: 200, description: 'Lista de API Keys recuperada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @UseGuards(RolesGuard)
    @Roles('admin', 'user')
    async listApiKeys(@Req() req: any) {
        const usuarioId = req.user?.id;
        const apiKeys = await this.authService.listApiKeys(usuarioId);

        return {
            message: 'API Keys recuperadas exitosamente',
            apiKeys: apiKeys.map(key => ({
                id: key.id,
                name: key.name,
                scopes: key.scopes,
                isActive: key.isActive,
                expiresAt: key.expiresAt,
                lastUsedAt: key.lastUsedAt,
                createdAt: key.createdAt,
            })),
        };
    }

    /**
     * DELETE /auth/api-keys/:id
     * Revoca una API key
     */
    @Delete('api-keys/:id')
    @ApiOperation({
        summary: 'Revocar API Key',
        description: 'Revoca/desactiva una API key específica'
    })
    @ApiSecurity('api-key')
    @ApiParam({ name: 'id', description: 'ID de la API key', type: 'number' })
    @ApiResponse({ status: 200, description: 'API Key revocada' })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @ApiResponse({ status: 404, description: 'API Key no encontrada' })
    @UseGuards(RolesGuard)
    @Roles('admin', 'user')
    @HttpCode(HttpStatus.OK)
    async revokeApiKey(@Param('id') id: string, @Req() req: any) {
        const usuarioId = req.user?.id;
        const success = await this.authService.revokeApiKey(Number(id), usuarioId);

        if (!success) {
            return {
                success: false,
                message: 'API Key no encontrada o no autorizado',
            };
        }

        this.logger.log(`API Key ${id} revocada por usuario ${usuarioId}`);

        return {
            success: true,
            message: 'API Key revocada exitosamente',
        };
    }

    /**
     * GET /auth/google
     * Inicia el flujo de autenticación OAuth con Google
     * ⚠️ TEMPORARILY DISABLED - Requires GOOGLE_CLIENT_ID in .env
     */
    /*
    @Get('google')
    @UseGuards(GoogleOAuthGuard)
    async googleAuth() {
        // El guard redirige automáticamente a Google
    }

    /**
     * GET /auth/google/callback
     * Callback de Google OAuth
     */
    /*
    @Get('google/callback')
    @UseGuards(GoogleOAuthGuard)
    async googleAuthCallback(@Req() req: any) {
        const usuario = req.user;

        this.logger.log(`Usuario autenticado via Google: ${usuario.correo}`);

        return {
            message: 'Autenticación exitosa con Google',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
            },
        };
    }
    */

    /**
     * GET /auth/profile
     * Retorna el perfil del usuario autenticado
     */
    @Get('profile')
    @ApiOperation({
        summary: 'Obtener perfil de usuario',
        description: 'Retorna el perfil del usuario autenticado'
    })
    @ApiSecurity('api-key')
    @ApiResponse({
        status: 200,
        description: 'Perfil de usuario',
        schema: {
            example: {
                message: 'Perfil de usuario',
                usuario: {
                    id: 1,
                    nombre: 'Juan Pérez',
                    correo: 'juan@example.com',
                    rol: 'admin'
                }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'No autenticado' })
    @UseGuards(RolesGuard)
    @Roles('admin', 'user')
    async getProfile(@Req() req: any) {
        const usuario = req.user;

        return {
            message: 'Perfil de usuario',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                rol: usuario.rol,
            },
        };
    }
}
