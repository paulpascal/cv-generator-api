import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkingExperienceInput } from './create-working-experience.dto';

export class UpdateWorkingExperienceDto extends PartialType(CreateWorkingExperienceInput) {}
