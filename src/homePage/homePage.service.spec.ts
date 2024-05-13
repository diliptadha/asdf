import { Test, TestingModule } from '@nestjs/testing';
import { HomePageService } from './homePage.service';

describe('DeveloperdashboardService', () => {
  let service: HomePageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomePageService],
    }).compile();

    service = module.get<HomePageService>(HomePageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
