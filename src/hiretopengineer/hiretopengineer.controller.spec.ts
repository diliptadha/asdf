import { Test, TestingModule } from '@nestjs/testing';
import { HiretopengineerController } from './hiretopengineer.controller';

describe('HiretopengineerController', () => {
  let controller: HiretopengineerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HiretopengineerController],
    }).compile();

    controller = module.get<HiretopengineerController>(
      HiretopengineerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
