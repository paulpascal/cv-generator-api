import { PartialType } from '@nestjs/mapped-types';
import { QueryOutput } from 'src/common/dtos/output.dto';
import { WorkingExperience } from '../entities/working-experience.entity';
import { CreateWorkingExperienceInput } from './create-working-experience.dto';

export class UpdateWorkingExperienceInput extends PartialType(CreateWorkingExperienceInput) {}

export class UpdateWorkingExperienceOutput extends QueryOutput {
    workingExperience?: WorkingExperience
}
