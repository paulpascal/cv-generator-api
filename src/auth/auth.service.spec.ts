import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { AuthConfig } from './auth.config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { AuthRegisterInput } from './dtos/register.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const mockValidate = jest.fn();
const mockUserService = () => ({
  createUser: jest.fn(),
});

const mockedConfig = {
  userPoolId: 'us-east-1_FRY8Mocked',
  clientId: 'mockedClientId',
  secret: 'secretKey',
};
const mockedUser: AuthRegisterInput = {
  email: 'test@example.com',
  name: 'test@example.com',
  password: 'P4ssW0rd1!',
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtStrategy: JwtStrategy;
  let userService: UserService;
  let authConfig: AuthConfig;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthConfig,
          useValue: {
            ...mockedConfig,
          },
        },
        {
          provide: JwtStrategy,
          useValue: mockValidate(),
        },
        { provide: UserService, useValue: mockUserService() },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    //jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userService = module.get<UserService>(UserService);
    authConfig = module.get<AuthConfig>(AuthConfig);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('cognitoRegister', () => {
    it('should register a cognito user', async () => {
      const mockedCongitoUserPool = new CognitoUserPool({
        UserPoolId: authConfig.userPoolId,
        ClientId: authConfig.clientId,
      });
      const expected = { userSub: 'userSub' };
      mockedCongitoUserPool.signUp = jest
        .fn()
        .mockImplementation(
          (username, password, userAttributes, validationData, cb) => {
            cb(null, expected);
          },
        );
      // Try console log auth.service on line 35-36 to see the resolve value
      const result = await service.cognitoRegister(mockedCongitoUserPool, {
        ...mockedUser,
      });
      expect(result).toEqual(expected);
    });
    it('should fail on rejection', async () => {
      const mockedCongitoUserPool = new CognitoUserPool({
        UserPoolId: authConfig.userPoolId,
        ClientId: authConfig.clientId,
      });
      const expected = new Error('User already exists');
      mockedCongitoUserPool.signUp = jest
        .fn()
        .mockImplementation(
          (username, password, userAttributes, validationData, cb) => {
            cb(expected);
          },
        );
      // Try console log auth.service on line 35-36 to see the resolve value
      await expect(
        service.cognitoRegister(mockedCongitoUserPool, {
          ...mockedUser,
        }),
      ).rejects.toThrow(expected);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      service.cognitoRegister = jest.fn().mockResolvedValue(true);
      userService.createUser = jest.fn().mockResolvedValue({ ok: true });
      const result = await service.register(mockedUser);
      expect(result).toEqual({ ok: true });
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        userId: undefined,
      });
    });
    it('should throw error on rejection', async () => {
      service.cognitoRegister = jest.fn().mockResolvedValue(true);
      userService.createUser = jest.fn().mockRejectedValue(new Error(':('));
      const result = await service.register(mockedUser);
      expect(result).toEqual({ ok: false, error: 'Cannot create account' });
      expect(userService.createUser).toHaveBeenCalledTimes(1);
      expect(userService.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        userId: undefined,
      });
    });
  });
});
