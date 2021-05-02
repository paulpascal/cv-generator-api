import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockRepository<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockRepository() },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserArgs = {
      email: 'test@email.com',
      userId: 'test@email.com',
    };

    it('should create a user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      const result = await service.createUser(createUserArgs);
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createUserArgs);
      expect(result).toEqual({ ok: true });
    });

    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: createUserArgs.email,
      });
      const result = await service.createUser(createUserArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'Email already exists',
      });
    });
    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error(':('));
      const result = await service.createUser(createUserArgs);
      expect(result).toEqual({ ok: false, error: 'Cannot create an account' });
    });
  });

  describe('findByUserId', () => {
    const findByIdArgs = { id: '1' };

    it('should find an existing user', async () => {
      usersRepository.findOne.mockResolvedValue(findByIdArgs);
      const result = await service.findByUserId('1');
      expect(result).toEqual({ ok: true, user: { id: '1' } });
    });

    it('should fail if no user is found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      const result = await service.findByUserId(findByIdArgs.id);
      expect(result).toEqual({ ok: false, error: 'User not found' });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error(':('));
      const result = await service.findByUserId(findByIdArgs.id);
      expect(result).toEqual({ ok: false, error: 'Cannot find user' });
    });
  });
});
