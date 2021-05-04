import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { WorkingExperience } from './entities/working-experience.entity';
import { WorkingExperienceService } from './working-experience.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

describe('WorkingExperienceService', () => {
  let service: WorkingExperienceService;
  let workingExperienceRepository: MockRepository<WorkingExperience>;
  let userRepository: MockRepository<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkingExperienceService,
        {
          provide: getRepositoryToken(WorkingExperience),
          useValue: mockRepository(),
        },
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();
    service = module.get<WorkingExperienceService>(WorkingExperienceService);
    workingExperienceRepository = module.get(
      getRepositoryToken(WorkingExperience),
    );
    userRepository = module.get(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
