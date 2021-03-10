import { Test, TestingModule } from '@nestjs/testing';
import { WorkingExperienceController } from './working-experience.controller';
import { WorkingExperienceService } from './working-experience.service';

describe('WorkingExperienceController', () => {
  let controller: WorkingExperienceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkingExperienceController],
      providers: [WorkingExperienceService],
    }).compile();

    controller = module.get<WorkingExperienceController>(WorkingExperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
