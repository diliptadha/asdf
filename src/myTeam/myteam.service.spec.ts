import { Test, TestingModule } from '@nestjs/testing';
import { MyteamService } from './myteam.service';

describe('MyteamService', () => {
  let service: MyteamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyteamService],
    }).compile();

    service = module.get<MyteamService>(MyteamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
