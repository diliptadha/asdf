import { Test, TestingModule } from '@nestjs/testing';
import { ClientdashboardService } from './clientdashboard.service';

describe('ClientdashboardService', () => {
  let service: ClientdashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientdashboardService],
    }).compile();

    service = module.get<ClientdashboardService>(ClientdashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
