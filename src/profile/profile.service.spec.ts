import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileService } from './profile.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepository: MockRepository<Profile>;
  let userRepository: MockRepository<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(Profile), useValue: mockRepository() },
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();
    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get(getRepositoryToken(Profile));
    userRepository = module.get(getRepositoryToken(User));
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
