import { Test, TestingModule } from '@nestjs/testing';
import { RolsController } from './rols.controller';

describe('RolsController', () => {
  let controller: RolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolsController],
    }).compile();

    controller = module.get<RolsController>(RolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
