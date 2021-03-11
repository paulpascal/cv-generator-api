import { PartialType } from '@nestjs/mapped-types';
import { QueryOutput } from 'src/common/dtos/output.dto';
import { Skillset } from '../entities/skillset.entity';
import { CreateSkillsetInput } from './create-Skillset.dto';


export class UpdateSkillsetInput extends PartialType(CreateSkillsetInput) {}

export class UpdateSkillsetOutput extends QueryOutput {
    skillset?: Skillset
}
