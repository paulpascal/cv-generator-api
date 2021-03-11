import { Test, TestingModule } from '@nestjs/testing';
import { SkillsetController } from './skillset.controller';
import { SkillsetService } from './skillset.service';

describe('SkillsetController', () => {
  let controller: SkillsetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SkillsetController],
      providers: [SkillsetService],
    }).compile();

    controller = module.get<SkillsetController>(SkillsetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
