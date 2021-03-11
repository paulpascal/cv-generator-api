import { Test, TestingModule } from '@nestjs/testing';
import { SkillsetService } from './skillset.service';

describe('SkillsetService', () => {
  let service: SkillsetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SkillsetService],
    }).compile();

    service = module.get<SkillsetService>(SkillsetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
