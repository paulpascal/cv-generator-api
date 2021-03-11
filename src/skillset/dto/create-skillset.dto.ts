import { OmitType } from "@nestjs/mapped-types";
import { QueryOutput } from "src/common/dtos/output.dto";
import { Skillset } from "../entities/skillset.entity";

export class CreateSkillsetInput extends OmitType(Skillset, ["user"]){}

export class CreateSkillsetOutput extends QueryOutput{}
