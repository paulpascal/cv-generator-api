import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { emptyUser, userWithWe } from 'src/_fixtures/user';
import { Repository } from 'typeorm';
import { CreateEducationInput } from './dto/create-education.dto';
import { UpdateEducationInput } from './dto/update-education.dto';
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
const createEducationInput: CreateEducationInput = new CreateEducationInput();
createEducationInput.institute = 'Institute name';

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

  describe('create', () => {
    it('should create a new education', async () => {
      const result = await service.create(emptyUser, createEducationInput);
      expect(result).toEqual({ ok: true });
      expect(educationRespository.create).toHaveBeenCalledTimes(1);
      expect(educationRespository.save).toHaveBeenCalledTimes(1);
    });
    it('should fail on reject', async () => {
      educationRespository.save.mockRejectedValueOnce(new Error('ops'));
      const result = await service.create(emptyUser, createEducationInput);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot create education',
      });
      expect(educationRespository.create).toHaveBeenCalledTimes(1);
      expect(educationRespository.save).toHaveBeenCalledTimes(1);
    });
    describe('findAll', () => {
      it('should get an array of educations', async () => {
        userRepository.findOne.mockResolvedValueOnce({
          id: 1,
          educations: { id: 2, user: { id: 1 } },
        });
        const result = await service.findAll(userWithWe);
        expect(result).toEqual({
          ok: true,
          educations: { id: 2, user: { id: 1 } },
        });
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      });
      it('should fail on rejection', async () => {
        userRepository.findOne.mockRejectedValueOnce(new Error('ops'));
        const result = await service.findAll(userWithWe);
        expect(result).toEqual({
          ok: false,
          error: 'Cannot find educations',
        });
        expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      });
    });
    describe('findOne', () => {
      it('should get an education', async () => {
        educationRespository.findOne.mockResolvedValueOnce({
          id: 1,
          user: { id: 1 },
        });
        const result = await service.findOne(userWithWe, 1);
        expect(result).toEqual({
          ok: true,
          education: { id: 1, user: { id: 1 } },
        });
        expect(educationRespository.findOne).toHaveBeenCalledTimes(1);
      });
      it('should fail if ed is not owned by user', async () => {
        educationRespository.findOne.mockResolvedValueOnce({
          id: 1,
          user: { id: 1 },
        });
        userWithWe.id = 3;
        const result = await service.findOne(userWithWe, 2);
        expect(result).toEqual({ ok: false, error: 'Permission denied' });
        expect(educationRespository.findOne).toHaveBeenCalledTimes(1);
      });
      it('should fail on rejection', async () => {
        educationRespository.findOne.mockRejectedValueOnce(new Error('ops'));
        const result = await service.findOne(userWithWe, 1);
        expect(result).toEqual({
          ok: false,
          error: 'Cannot find education',
        });
        expect(educationRespository.findOne).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('remove', () => {
    it('should delete a working experience', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce({
        education: { id: 1, user: { id: 1 } },
      });
      educationRespository.delete.mockResolvedValueOnce(true);
      userWithWe.id = 1;
      const result = await service.remove(userWithWe, 1);
      expect(result).toEqual({ ok: true });
    });
    it('should fail on user id not belonging to we', async () => {
      service.findOne = jest.fn().mockResolvedValueOnce({
        education: { id: 1, user: { id: 1 } },
      });
      educationRespository.delete.mockResolvedValueOnce(true);
      userWithWe.id = 2;
      const result = await service.remove(userWithWe, 1);
      userWithWe.id = 1;
      expect(result).toEqual({ ok: false, error: 'Permission denied' });
    });
    it('should fail on no we', async () => {
      educationRespository.delete.mockRejectedValue(new Error('ops'));
      const result = await service.remove(userWithWe, 1);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot find education',
      });
    });
    it('should fail on rejection', async () => {
      educationRespository.delete.mockRejectedValue(new Error('ops'));
      service.findOne = jest.fn().mockRejectedValueOnce(new Error('ops'));
      const result = await service.remove(userWithWe, 1);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot remove education',
      });
    });
  });
  describe('update', () => {
    it('should get an array of working experiences', async () => {
      const updateEdInput = new UpdateEducationInput();
      updateEdInput.title = 'Updated title';
      educationRespository.save.mockResolvedValueOnce(true);
      service.findOne = jest.fn().mockResolvedValueOnce({
        education: { id: 1, user: { id: 1 } },
      });
      const result = await service.update(userWithWe, 1, updateEdInput);
      expect(result).toEqual({
        ok: true,
        education: { id: 1, user: { id: 1 } },
      });
    });
    it('should fail on rejection', async () => {
      const updateEdInput = new UpdateEducationInput();
      updateEdInput.title = 'Updated title';
      educationRespository.save.mockResolvedValueOnce(true);
      service.findOne = jest.fn().mockRejectedValueOnce(new Error('ops'));
      const result = await service.update(userWithWe, 1, updateEdInput);
      expect(result).toEqual({
        ok: false,
        error: 'Cannot update education',
      });
    });
  });
});
