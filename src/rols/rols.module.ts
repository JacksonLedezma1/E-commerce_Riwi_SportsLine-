import { Module } from '@nestjs/common';
import { RolsService } from './rols.service';
import { RolsController } from './rols.controller';

@Module({
  providers: [RolsService],
  controllers: [RolsController]
})
export class RolsModule {}
