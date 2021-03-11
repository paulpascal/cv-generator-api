import { QueryOutput } from "src/common/dtos/output.dto";
import { WorkingExperience } from "../entities/working-experience.entity";

export class GetAllWorkingExperiencesOutput extends QueryOutput{
    workingExperiences?:WorkingExperience[]
}
