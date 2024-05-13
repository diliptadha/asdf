import { Test, TestingModule } from '@nestjs/testing';
import { DevdashboardController } from './devdashboard.controller';

describe('DevdashboardController', () => {
  let controller: DevdashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevdashboardController],
    }).compile();

    controller = module.get<DevdashboardController>(DevdashboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
