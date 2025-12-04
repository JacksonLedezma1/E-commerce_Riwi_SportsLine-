import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiKeyGuard } from '../guards/api-key.guard';

@ApiTags('External API')
@Controller('external')
export class ExternalApiController {

  @Get()
  @ApiOperation({ summary: 'Endpoint protegido con API Key' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key para acceso externo',
    required: true,
  })
  @UseGuards(ApiKeyGuard)
  getExternalData() {
    return { ok: true, message: 'Acceso concedido por API Key' };
  }
}
