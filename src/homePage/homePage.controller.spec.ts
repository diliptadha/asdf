import { Test, TestingModule } from '@nestjs/testing';
import { HomePageController } from './homePage.controller';

describe('DeveloperdashboardController', () => {
  let controller: HomePageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomePageController],
    }).compile();

    controller = module.get<HomePageController>(HomePageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
