import { Test, TestingModule } from '@nestjs/testing';
import { MyteamController } from './myteam.controller';

describe('MyteamController', () => {
  let controller: MyteamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyteamController],
    }).compile();

    controller = module.get<MyteamController>(MyteamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
