import { Test, TestingModule } from '@nestjs/testing';
import { DevdashboardService } from './devdashboard.service';

describe('DevdashboardService', () => {
  let service: DevdashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevdashboardService],
    }).compile();

    service = module.get<DevdashboardService>(DevdashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
