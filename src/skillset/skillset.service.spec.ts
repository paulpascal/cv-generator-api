import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { emptyUser, userWithWe } from 'src/_fixtures/user';
import { Repository } from 'typeorm';
import { UpdateSkillsetInput } from './dto/update-skillset.dto';
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

const createSkillsetInput = new Skillset();
createSkillsetInput.title = 'title';

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
  describe('create', () => {
    it('should create a new skillset', async () => {
      const result = await service.create(emptyUser, createSkillsetInput);
      expect(result).toEqual({ ok: true });
      expect(skillsetRepository.create).toHaveBeenCalledTimes(1);
      expect(skillsetRepository.save).toHaveBeenCalledTimes(1);
    });
    it('should fail on reject', async () => {
      skillsetRepository.save.mockRejectedValueOnce(new Error('ops'));
      const result = await service.create(emptyUser, createSkillsetInput);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot create skillset',
      });
      expect(skillsetRepository.create).toHaveBeenCalledTimes(1);
      expect(skillsetRepository.save).toHaveBeenCalledTimes(1);
    });
  });
  describe('findAll', () => {
    it('should get an array of educations', async () => {
      userRepository.findOne.mockResolvedValueOnce({
        id: 1,
        skillsets: [{ id: 2, user: { id: 1 } }],
      });
      const result = await service.findAll(userWithWe);
      expect(result).toEqual({
        ok: true,
        skillsets: [{ id: 2, user: { id: 1 } }],
      });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should fail on rejection', async () => {
      userRepository.findOne.mockRejectedValueOnce(new Error('ops'));
      const result = await service.findAll(userWithWe);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot find skillsets',
      });
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('findOne', () => {
    it('should get an skillset', async () => {
      skillsetRepository.findOne.mockResolvedValueOnce({
        id: 1,
        user: { id: 1 },
      });
      const result = await service.findOne(userWithWe, 1);
      expect(result).toEqual({
        ok: true,
        skillset: { id: 1, user: { id: 1 } },
      });
      expect(skillsetRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should fail if ed is not owned by user', async () => {
      skillsetRepository.findOne.mockResolvedValueOnce({
        id: 1,
        user: { id: 1 },
      });
      userWithWe.id = 3;
      const result = await service.findOne(userWithWe, 2);
      expect(result).toEqual({ ok: false, error: 'Permission denied' });
      expect(skillsetRepository.findOne).toHaveBeenCalledTimes(1);
    });
    it('should fail on rejection', async () => {
      skillsetRepository.findOne.mockRejectedValueOnce(new Error('ops'));
      const result = await service.findOne(userWithWe, 1);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot find skillset',
      });
      expect(skillsetRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('remove', () => {
    it('should delete a working experience', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce({
        skillset: { id: 1, user: { id: 1 } },
      });
      skillsetRepository.delete.mockResolvedValueOnce(true);
      userWithWe.id = 1;
      const result = await service.remove(userWithWe, 1);
      expect(result).toEqual({ ok: true });
    });
    it('should fail on user id not belonging to we', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce({
        skillset: { id: 1, user: { id: 1 } },
      });
      skillsetRepository.delete.mockResolvedValueOnce(true);
      userWithWe.id = 2;
      const result = await service.remove(userWithWe, 1);
      userWithWe.id = 1;
      expect(result).toEqual({ ok: false, error: 'Permission denied' });
    });
    it('should fail on no we', async () => {
      skillsetRepository.delete.mockRejectedValue(new Error('ops'));
      const result = await service.remove(userWithWe, 1);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot find skillset',
      });
    });
    it('should fail on rejection', async () => {
      skillsetRepository.delete.mockRejectedValue(new Error('ops'));
      service.findOne = jest.fn().mockRejectedValueOnce(new Error('ops'));
      const result = await service.remove(userWithWe, 1);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot remove skillset',
      });
    });
  });
  describe('update', () => {
    it('should get an array of working experiences', async () => {
      const updateEdInput = new UpdateSkillsetInput();
      updateEdInput.title = 'Updated title';
      skillsetRepository.save.mockResolvedValueOnce(true);
      service.findOne = jest.fn().mockResolvedValueOnce({
        skillset: { id: 1, user: { id: 1 } },
      });
      const result = await service.update(userWithWe, 1, updateEdInput);
      expect(result).toEqual({
        ok: true,
        skillset: { id: 1, user: { id: 1 } },
      });
    });
    it('should fail on rejection', async () => {
      const updateEdInput = new UpdateSkillsetInput();
      updateEdInput.title = 'Updated title';
      skillsetRepository.save.mockResolvedValueOnce(true);
      service.findOne = jest.fn().mockRejectedValueOnce(new Error('ops'));
      const result = await service.update(userWithWe, 1, updateEdInput);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot update skillset',
      });
    });
  });
});
