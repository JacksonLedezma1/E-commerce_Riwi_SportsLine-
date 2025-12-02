import { Module } from '@nestjs/common';
import { RolsService } from './rols.service';
import { RolsController } from './rols.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/rol.entity';
import { Permission } from './entities/permission.entity';
import { PermissionService } from './permissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Permission])
  ],
  controllers: [RolsController],
  providers: [RolsService, PermissionService],
  exports: [RolsService, PermissionService]
})
export class RolsModule {}
