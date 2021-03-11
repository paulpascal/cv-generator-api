import { PartialType } from '@nestjs/mapped-types';
import { QueryOutput } from 'src/common/dtos/output.dto';
import { Education } from '../entities/education.entity';
import { CreateEducationInput } from './create-education.dto';


export class UpdateEducationInput extends PartialType(CreateEducationInput) {}

export class UpdateEducationOutput extends QueryOutput {
    education?: Education
}
