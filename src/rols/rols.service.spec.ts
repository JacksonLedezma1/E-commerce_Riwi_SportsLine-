import { Test, TestingModule } from '@nestjs/testing';
import { RolsService } from './rols.service';

describe('RolsService', () => {
  let service: RolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolsService],
    }).compile();

    service = module.get<RolsService>(RolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
