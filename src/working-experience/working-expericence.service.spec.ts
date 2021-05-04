import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { emptyUser, userWithWe } from 'src/_fixtures/user';
import { Repository } from 'typeorm';
import { CreateWorkingExperienceInput } from './dto/create-working-experience.dto';
import { UpdateWorkingExperienceInput } from './dto/update-working-experience.dto';
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

const createWorkingExperienceInput: CreateWorkingExperienceInput = new CreateWorkingExperienceInput();

createWorkingExperienceInput.title = 'Experience Title';
createWorkingExperienceInput.position = 'Work position';
createWorkingExperienceInput.startDate = 'May 2010';
createWorkingExperienceInput.endDate = 'May 2020';
createWorkingExperienceInput.isActual = false;
createWorkingExperienceInput.description = 'Lorem ipsum';

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

  describe('create', () => {
    it('should create a new working experience', async () => {
      const result = await service.create(
        emptyUser,
        createWorkingExperienceInput,
      );
      expect(result).toEqual({ ok: true });
      expect(workingExperienceRepository.create).toHaveBeenCalledTimes(1);
      expect(workingExperienceRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should fail on reject', async () => {
      workingExperienceRepository.save.mockRejectedValueOnce(new Error('ops'));
      const result = await service.create(
        emptyUser,
        createWorkingExperienceInput,
      );
      expect(result).toEqual({
        ok: false,
        error: 'Cannot create working experience',
      });
      expect(workingExperienceRepository.create).toHaveBeenCalledTimes(1);
      expect(workingExperienceRepository.save).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAll', () => {
    it('should get an array of working experiences', async () => {
      userRepository.findOne.mockResolvedValueOnce(userWithWe);
      const result = await service.findAll(userWithWe);
      expect(result).toEqual({
        ok: true,
        workingExperiences: userWithWe.workingExperiences,
      });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should fail on rejection', async () => {
      userRepository.findOne.mockRejectedValueOnce(new Error('ops'));
      const result = await service.findAll(userWithWe);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot find working experience',
      });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('findOne', () => {
    it('should get a working experience', async () => {
      workingExperienceRepository.findOne.mockResolvedValueOnce({
        id: 1,
        user: { id: 1 },
      });
      const result = await service.findOne(userWithWe, 1);
      expect(result).toEqual({
        ok: true,
        workingExperience: { id: 1, user: { id: 1 } },
      });
      expect(workingExperienceRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should fail if we is not owned by user', async () => {
      workingExperienceRepository.findOne.mockResolvedValueOnce({
        id: 1,
        user: { id: 1 },
      });
      userWithWe.id = 3;
      const result = await service.findOne(userWithWe, 2);
      expect(result).toEqual({ ok: false, error: 'Permission denied' });
      expect(workingExperienceRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should fail on rejection', async () => {
      workingExperienceRepository.findOne.mockRejectedValueOnce(
        new Error('ops'),
      );
      const result = await service.findOne(userWithWe, 1);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot find working experience',
      });
      expect(workingExperienceRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('update', () => {
    it('should get an array of working experiences', async () => {
      const updateWeInput = new UpdateWorkingExperienceInput();
      updateWeInput.title = 'Updated title';
      workingExperienceRepository.save.mockResolvedValueOnce(true);
      service.findOne = jest.fn().mockResolvedValueOnce({
        workingExperience: { id: 1, user: { id: 1 } },
      });
      const result = await service.update(userWithWe, 1, updateWeInput);
      expect(result).toEqual({
        ok: true,
        workingExperience: { id: 1, user: { id: 1 } },
      });
    });
    it('should fail on rejection', async () => {
      const updateWeInput = new UpdateWorkingExperienceInput();
      updateWeInput.title = 'Updated title';
      workingExperienceRepository.save.mockResolvedValueOnce(true);
      service.findOne = jest.fn().mockRejectedValueOnce(new Error('ops'));
      const result = await service.update(userWithWe, 1, updateWeInput);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot update working experience',
      });
    });
    describe('remove', () => {
      it('should delete a working experience', async () => {
        service.findOne = jest.fn().mockResolvedValueOnce({
          workingExperience: { id: 1, user: { id: 1 } },
        });
        workingExperienceRepository.delete.mockResolvedValueOnce(true);
        userWithWe.id = 1;
        const result = await service.remove(userWithWe, 1);
        expect(result).toEqual({ ok: true });
      });
      it('should fail on user id not belonging to we', async () => {
        service.findOne = jest.fn().mockResolvedValueOnce({
          workingExperience: { id: 1, user: { id: 1 } },
        });
        workingExperienceRepository.delete.mockResolvedValueOnce(true);
        userWithWe.id = 2;
        const result = await service.remove(userWithWe, 1);
        userWithWe.id = 1;
        expect(result).toEqual({ ok: false, error: 'Permission denied' });
      });
      it('should fail on no we', async () => {
        workingExperienceRepository.delete.mockRejectedValue(new Error('ops'));
        const result = await service.remove(userWithWe, 1);
        expect(result).toEqual({
          ok: false,
          error: 'Cannot find working experience',
        });
      });
      it('should fail on rejection', async () => {
        workingExperienceRepository.delete.mockRejectedValue(new Error('ops'));
        service.findOne = jest.fn().mockRejectedValueOnce(new Error('ops'));
        const result = await service.remove(userWithWe, 1);
        expect(result).toEqual({
          ok: false,
          error: 'Cannot remove working experience',
        });
      });
    });
  });
});
