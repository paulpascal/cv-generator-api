import { QueryOutput } from "src/common/dtos/output.dto";
import { Skillset } from "../entities/skillset.entity";

export class FindSkillsetOutput extends QueryOutput{
    skillset?:Skillset
}