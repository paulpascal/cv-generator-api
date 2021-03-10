import { Test, TestingModule } from '@nestjs/testing';
import { WorkingExperienceService } from './working-experience.service';

describe('WorkingExperienceService', () => {
  let service: WorkingExperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkingExperienceService],
    }).compile();

    service = module.get<WorkingExperienceService>(WorkingExperienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
