import { Test, TestingModule } from '@nestjs/testing';
import { HiretopengineerService } from './hiretopengineer.service';

describe('HiretopengineerService', () => {
  let service: HiretopengineerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HiretopengineerService],
    }).compile();

    service = module.get<HiretopengineerService>(HiretopengineerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
