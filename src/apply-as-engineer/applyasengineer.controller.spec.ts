import { Test, TestingModule } from '@nestjs/testing';
import { ApplyAsEngineerController } from './applyasengineer.controller';

describe('ApplyAsEngineerController', () => {
  let controller: ApplyAsEngineerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplyAsEngineerController],
    }).compile();

    controller = module.get<ApplyAsEngineerController>(
      ApplyAsEngineerController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
