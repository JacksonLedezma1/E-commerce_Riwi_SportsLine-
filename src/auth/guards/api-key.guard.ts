import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { ApiKeyService } from "../Api/api-key.service";
import { Reflector } from "@nestjs/core";
import { SCOPES_KEY } from "../decorators/scopes.decorator";

@Injectable()
export class ApiKeyGuard implements CanActivate{
    constructor(
        private readonly apiKeyService: ApiKeyService,
        private readonly reflector: Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const apiKeyHeader = request.headers['x-api-key'];
        if (!apiKeyHeader){
            throw new ForbiddenException('missing API key');
        }

        const apiKey = await this.apiKeyService.validateApiKey(apiKeyHeader);
    request.apiKey = apiKey;

    const requiredScopes =
      this.reflector.get<string[]>(SCOPES_KEY, context.getHandler()) || [];

    if (requiredScopes.length > 0) {
      const hasPermission = requiredScopes.every((s) =>
        apiKey.scopes.includes(s),
      );

      if (!hasPermission) {
        throw new ForbiddenException('Insufficient API key permissions');
      }
    }
    return true;
  }
}