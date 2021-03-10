import { Injectable } from '@nestjs/common';
import { CreateWorkingExperienceDto } from './dto/create-working-experience.dto';
import { UpdateWorkingExperienceDto } from './dto/update-working-experience.dto';

@Injectable()
export class WorkingExperienceService {
  create(createWorkingExperienceDto: CreateWorkingExperienceDto) {
    return 'This action adds a new workingExperience';
  }

  findAll() {
    return `This action returns all workingExperience`;
  }

  findOne(id: number) {
    return `This action returns a #${id} workingExperience`;
  }

  update(id: number, updateWorkingExperienceDto: UpdateWorkingExperienceDto) {
    return `This action updates a #${id} workingExperience`;
  }

  remove(id: number) {
    return `This action removes a #${id} workingExperience`;
  }
}
