import { QueryOutput } from "src/common/dtos/output.dto";
import { Education } from "../entities/education.entity";

export class FindEducationOutput extends QueryOutput{
    education?:Education
}