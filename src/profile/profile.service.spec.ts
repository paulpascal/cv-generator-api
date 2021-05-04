import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { completeUser, emptyUser, userWithProfile } from 'src/_fixtures/user';
import { Repository } from 'typeorm';
import { CreateProfileInput } from './dtos/create-profile.dto';
import { UpdateProfileInput } from './dtos/update-profile';
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

const createProfileInput: CreateProfileInput = new Profile();
createProfileInput.name = 'John Doe';
createProfileInput.email = 'test@example.com';
createProfileInput.phone = '+393347001378';
createProfileInput.website = 'wwww.example.com';
createProfileInput.workTitle = 'FE Developer';
createProfileInput.photoUrl = 'https://imgUrl.com';
createProfileInput.biography = 'Lorem ipsum';
createProfileInput.bottomNotes = "['lorem', 'ipsum']";

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

  describe('createProfile', () => {
    it('should create a profile', async () => {
      const result = await service.createProfile(emptyUser, createProfileInput);
      expect(result).toEqual({ ok: true });
      expect(profileRepository.create).toHaveBeenCalledTimes(1);
      expect(profileRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should throw error if user already has profile', async () => {
      const erroredUser = { ...emptyUser };
      erroredUser.profile = new Profile();

      const result = await service.createProfile(
        erroredUser,
        createProfileInput,
      );

      expect(result).toEqual({
        ok: false,
        error: 'User already has a profile',
      });
      expect(profileRepository.create).toHaveBeenCalledTimes(0);
      expect(profileRepository.save).toHaveBeenCalledTimes(0);
    });
    it('should throw error on rejection', async () => {
      profileRepository.save.mockRejectedValueOnce(new Error('ops'));
      const result = await service.createProfile(emptyUser, createProfileInput);
      expect(result).toEqual({ ok: false, error: 'Cannot create profile' });
      expect(profileRepository.create).toHaveBeenCalledTimes(1);
      expect(profileRepository.save).toHaveBeenCalledTimes(1);
    });
  });
  describe('getProfile', () => {
    it('should get a profile', async () => {
      userRepository.findOne.mockResolvedValueOnce({
        profile: userWithProfile.profile,
      });
      const result = await service.getProfile(userWithProfile);
      expect(result).toEqual({ ok: true, profile: userWithProfile.profile });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should return error if profile is not found', async () => {
      userRepository.findOne.mockResolvedValueOnce(undefined);
      const result = await service.getProfile(userWithProfile);
      expect(result).toEqual({ ok: false, error: 'Cannot get profile' });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(
        { id: userWithProfile.id },
        { relations: ['profile'] },
      );
    });
  });
  describe('updateProfile', () => {
    it('should update a profile', async () => {
      const updateProfileInput = new UpdateProfileInput();
      updateProfileInput.name = 'Jane Doe';
      userRepository.findOne.mockResolvedValueOnce({
        profile: userWithProfile.profile,
      });
      profileRepository.save.mockResolvedValueOnce({ profile: { id: 1 } });
      profileRepository.findOne.mockResolvedValueOnce(userWithProfile.profile);

      const result = await service.updateProfile(
        userWithProfile,
        updateProfileInput,
      );
      expect(result).toEqual({ ok: true, profile: userWithProfile.profile });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(profileRepository.save).toHaveBeenCalledTimes(1);
      expect(profileRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should error if profile not found', async () => {
      const updateProfileInput = new UpdateProfileInput();
      updateProfileInput.name = 'Jane Doe';
      userRepository.findOne.mockResolvedValueOnce({
        profile: undefined,
      });
      profileRepository.save.mockResolvedValueOnce({ profile: { id: 1 } });
      profileRepository.findOne.mockResolvedValueOnce(userWithProfile.profile);

      const result = await service.updateProfile(
        userWithProfile,
        updateProfileInput,
      );
      expect(result).toEqual({ ok: false, error: 'Profile not found' });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should throw error on rejection', async () => {
      const updateProfileInput = new UpdateProfileInput();
      updateProfileInput.name = 'Jane Doe';
      userRepository.findOne.mockRejectedValueOnce(new Error('ops'));
      const result = await service.updateProfile(
        userWithProfile,
        updateProfileInput,
      );
      expect(result).toEqual({ ok: false, error: 'Cannot update profile' });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('getCompleteProfile', () => {
    it('should get a complete profile', async () => {
      userRepository.findOne.mockResolvedValueOnce(completeUser);
      const result = await service.getCompleteUserProfile(completeUser);
      expect(result).toEqual({ ok: true, user: completeUser });
    });
    it('should fail on rejection', async () => {
      userRepository.findOne.mockRejectedValueOnce(new Error('ops'));
      const result = await service.getCompleteUserProfile(completeUser);
      expect(result).toEqual({ ok: false, error: 'Cannot get user' });
    });
  });
});
