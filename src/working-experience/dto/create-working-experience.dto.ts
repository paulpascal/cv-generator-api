import { OmitType } from "@nestjs/mapped-types";
import { QueryOutput } from "src/common/dtos/output.dto";
import { WorkingExperience } from "../entities/working-experience.entity";

export class CreateWorkingExperienceInput extends OmitType(WorkingExperience, ["user"]){}

export class CreateWorkingExperienceOutput extends QueryOutput{}
