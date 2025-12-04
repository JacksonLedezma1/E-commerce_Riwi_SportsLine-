import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ApiKey } from './entities/api-key.entity';
import { OAuthUser } from './entities/oauth-user.entity';
import { Usuario } from '../Usuarios/usuario.entity';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger('AuthService');

    constructor(
        @InjectRepository(ApiKey)
        private apiKeyRepository: Repository<ApiKey>,
        @InjectRepository(OAuthUser)
        private oauthUserRepository: Repository<OAuthUser>,
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) { }

    /**
     * Genera una nueva API key con scopes específicos
     */
    async generateApiKey(createApiKeyDto: CreateApiKeyDto, usuarioId?: number): Promise<{ apiKey: ApiKey; plainKey: string }> {
        // Generar clave aleatoria segura
        const plainKey = crypto.randomBytes(32).toString('hex');

        // Hash de la clave para almacenamiento seguro
        const hashedKey = await bcrypt.hash(plainKey, 10);

        const apiKey = this.apiKeyRepository.create({
            key: hashedKey,
            name: createApiKeyDto.name,
            scopes: createApiKeyDto.scopes,
            usuarioId: usuarioId,
            expiresAt: createApiKeyDto.expiresAt ? new Date(createApiKeyDto.expiresAt) : undefined,
            isActive: true,
        });

        await this.apiKeyRepository.save(apiKey);

        this.logger.log(`API Key creada: ${apiKey.name} (ID: ${apiKey.id})`);

        // Retornar la clave en texto plano solo una vez
        return { apiKey, plainKey };
    }

    /**
     * Valida una API key y retorna sus detalles si es válida
     */
    async validateApiKey(plainKey: string): Promise<ApiKey | null> {
        const apiKeys = await this.apiKeyRepository.find({
            where: { isActive: true },
            relations: ['usuario'],
        });

        for (const apiKey of apiKeys) {
            const isValid = await bcrypt.compare(plainKey, apiKey.key);

            if (isValid) {
                // Verificar expiración
                if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
                    this.logger.warn(`API Key expirada: ${apiKey.name}`);
                    return null;
                }

                // Actualizar último uso
                apiKey.lastUsedAt = new Date();
                await this.apiKeyRepository.save(apiKey);

                return apiKey;
            }
        }

        return null;
    }

    /**
     * Revoca (desactiva) una API key
     */
    async revokeApiKey(id: number, usuarioId?: number): Promise<boolean> {
        const apiKey = await this.apiKeyRepository.findOne({ where: { id } });

        if (!apiKey) {
            return false;
        }

        // Si se proporciona usuarioId, verificar que la key pertenece al usuario
        if (usuarioId && apiKey.usuarioId !== usuarioId) {
            return false;
        }

        apiKey.isActive = false;
        await this.apiKeyRepository.save(apiKey);

        this.logger.log(`API Key revocada: ${apiKey.name} (ID: ${id})`);
        return true;
    }

    /**
     * Lista todas las API keys de un usuario
     */
    async listApiKeys(usuarioId?: number): Promise<ApiKey[]> {
        const where = usuarioId ? { usuarioId } : {};
        return this.apiKeyRepository.find({ where, relations: ['usuario'] });
    }

    /**
     * Valida si una API key tiene los scopes requeridos
     */
    validateScopes(apiKey: ApiKey, requiredScopes: string[]): boolean {
        if (!requiredScopes || requiredScopes.length === 0) {
            return true;
        }

        return requiredScopes.every(scope => apiKey.scopes.includes(scope));
    }

    /**
     * Maneja el login OAuth y crea/vincula usuario
     */
    async handleOAuthLogin(
        provider: string,
        providerId: string,
        email: string,
        name: string,
        accessToken?: string,
        refreshToken?: string,
    ): Promise<Usuario> {
        // Buscar si ya existe vinculación OAuth
        let oauthUser = await this.oauthUserRepository.findOne({
            where: { provider, providerId },
            relations: ['usuario'],
        });

        if (oauthUser) {
            // Actualizar tokens si se proporcionan
            if (accessToken) oauthUser.accessToken = accessToken;
            if (refreshToken) oauthUser.refreshToken = refreshToken;
            await this.oauthUserRepository.save(oauthUser);

            this.logger.log(`Usuario OAuth existente: ${email} (${provider})`);
            return oauthUser.usuario;
        }

        // Buscar usuario por email
        let usuario = await this.usuarioRepository.findOne({ where: { correo: email } });

        if (!usuario) {
            // Crear nuevo usuario
            usuario = this.usuarioRepository.create({
                nombre: name,
                correo: email,
                contrasena: crypto.randomBytes(32).toString('hex'), // Contraseña aleatoria
                rol: 'user', // Rol por defecto
            });
            await this.usuarioRepository.save(usuario);
            this.logger.log(`Nuevo usuario creado desde OAuth: ${email}`);
        }

        // Crear vinculación OAuth
        oauthUser = this.oauthUserRepository.create({
            provider,
            providerId,
            email,
            usuarioId: usuario.id,
            accessToken,
            refreshToken,
        });
        await this.oauthUserRepository.save(oauthUser);

        this.logger.log(`Nueva vinculación OAuth: ${email} (${provider})`);
        return usuario;
    }
}
