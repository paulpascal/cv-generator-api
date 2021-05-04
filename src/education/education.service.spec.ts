import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { EducationService } from './education.service';
import { Education } from './entities/education.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

describe('EducationService', () => {
  let service: EducationService;
  let educationRespository: MockRepository<Education>;
  let userRepository: MockRepository<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EducationService,
        { provide: getRepositoryToken(Education), useValue: mockRepository() },
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();
    service = module.get<EducationService>(EducationService);
    educationRespository = module.get(getRepositoryToken(Education));
    userRepository = module.get(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
