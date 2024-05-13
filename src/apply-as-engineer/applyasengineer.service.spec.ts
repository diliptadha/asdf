import { Test, TestingModule } from '@nestjs/testing';
import { ApplyAsEngineerService } from './applyasengineer.service';

describe('ApplyAsEngineerService', () => {
  let service: ApplyAsEngineerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApplyAsEngineerService],
    }).compile();

    service = module.get<ApplyAsEngineerService>(ApplyAsEngineerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
