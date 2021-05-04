import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Skillset } from './entities/skillset.entity';
import { SkillsetService } from './skillset.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

describe('SkillsetService', () => {
  let service: SkillsetService;
  let skillsetRepository: MockRepository<Skillset>;
  let userRepository: MockRepository<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SkillsetService,
        { provide: getRepositoryToken(Skillset), useValue: mockRepository() },
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();
    service = module.get<SkillsetService>(SkillsetService);
    skillsetRepository = module.get(getRepositoryToken(Skillset));
    userRepository = module.get(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
