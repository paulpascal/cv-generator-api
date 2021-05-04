import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateWorkingExperienceInput,
  CreateWorkingExperienceOutput,
} from './dto/create-working-experience.dto';
import { FindWorkingExperienceOutput } from './dto/find-working-experience.dto';
import { GetAllWorkingExperiencesOutput } from './dto/get-all-working-experiences.dto';
import {
  UpdateWorkingExperienceInput,
  UpdateWorkingExperienceOutput,
} from './dto/update-working-experience.dto';
import { WorkingExperience } from './entities/working-experience.entity';

@Injectable()
export class WorkingExperienceService {
  constructor(
    @InjectRepository(WorkingExperience)
    private readonly workingExperience: Repository<WorkingExperience>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {}

  async create(
    user: User,
    createWorkingExperienceInput: CreateWorkingExperienceInput,
  ): Promise<CreateWorkingExperienceOutput> {
    try {
      await this.workingExperience.save(
        this.workingExperience.create({
          ...createWorkingExperienceInput,
          user,
        }),
      );
      return { ok: true };
    } catch {
      return { ok: false, error: 'Cannot create working experience' };
    }
  }

  async findAll(user: User): Promise<GetAllWorkingExperiencesOutput> {
    try {
      const userWithRel = await this.users.findOne(
        { id: user.id },
        { relations: ['workingExperiences'] },
      );
      return { ok: true, workingExperiences: userWithRel.workingExperiences };
    } catch {
      return { ok: false, error: 'Cannot find working experience' };
    }
  }

  async findOne(user: User, id: number): Promise<FindWorkingExperienceOutput> {
    try {
      const workingExperience = await this.workingExperience.findOne(
        { id },
        { relations: ['user'] },
      );
      if (user.id !== workingExperience.user.id) {
        return { ok: false, error: 'Permission denied' };
      }
      return { ok: true, workingExperience };
    } catch {
      return { ok: false, error: 'Cannot find working experience' };
    }
  }

  async update(
    user: User,
    id: number,
    UpdateWorkingExperienceInput: UpdateWorkingExperienceInput,
  ): Promise<UpdateWorkingExperienceOutput> {
    try {
      await this.workingExperience.save({
        id,
        ...UpdateWorkingExperienceInput,
      });
      const { workingExperience } = await this.findOne(user, id);
      return { ok: true, workingExperience };
    } catch {
      return { ok: false, error: 'Cannot update working experience' };
    }
  }

  async remove(user: User, id: number) {
    try {
      const { workingExperience } = await this.findOne(user, id);
      if (!workingExperience) {
        return { ok: false, error: 'Cannot find working experience' };
      }
      if (workingExperience.user.id === user.id) {
        await this.workingExperience.delete({ id });
        return { ok: true };
      }
      return { ok: false, error: 'Permission denied' };
    } catch {
      return { ok: false, error: 'Cannot remove working experience' };
    }
  }
}
