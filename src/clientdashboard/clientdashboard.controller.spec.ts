import { Test, TestingModule } from '@nestjs/testing';
import { ClientdashboardController } from './clientdashboard.controller';

describe('ClientdashboardController', () => {
  let controller: ClientdashboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientdashboardController],
    }).compile();

    controller = module.get<ClientdashboardController>(
      ClientdashboardController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
