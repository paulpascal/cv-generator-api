import { QueryOutput } from "src/common/dtos/output.dto";
import { Profile } from "../entities/profile.entity";

export class GetProfileOutput extends QueryOutput {
    profile?: Profile;
}