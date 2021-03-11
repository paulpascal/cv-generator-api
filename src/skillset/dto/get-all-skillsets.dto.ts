import { QueryOutput } from "src/common/dtos/output.dto";
import { Skillset } from "../entities/Skillset.entity";

export class GetAllSkillsetsOutput extends QueryOutput{
    skillsets?:Skillset[]
}
