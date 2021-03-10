import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkingExperienceDto } from './create-working-experience.dto';

export class UpdateWorkingExperienceDto extends PartialType(CreateWorkingExperienceDto) {}
