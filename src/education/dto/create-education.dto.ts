import { OmitType } from "@nestjs/mapped-types";
import { QueryOutput } from "src/common/dtos/output.dto";
import { Education } from "../entities/education.entity";

export class CreateEducationInput extends OmitType(Education, ["user"]){}

export class CreateEducationOutput extends QueryOutput{}
