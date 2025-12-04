import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiKey } from "./api-key.entity";
import { Repository } from "typeorm";
import { randomBytes } from "crypto";

@Injectable()
export class ApiKeyService {
    constructor(
        @InjectRepository(ApiKey)
        private readonly apiKeyRepository: Repository<ApiKey>,
    ){}

    async createApiKey(owner: string, scopes: string[]) {
        const key = randomBytes(32).toString('hex');
        const apiKey = this.apiKeyRepository.create({
            key,
            owner,
            scopes,
        });

        await this.apiKeyRepository.save(apiKey);
        return { key, scopes };
    }

    async validateApiKey(key: string){
        const apiKey = await this.apiKeyRepository.findOne({ where: { key } });
        if (!apiKey || !apiKey.isActive) {
            throw new NotFoundException('API Key no válida o inactiva');
        }
        return apiKey;
    }
}