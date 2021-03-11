import { QueryOutput } from "src/common/dtos/output.dto";
import { User } from "src/user/entities/user.entity";

export class GetCompleteUserProfileOutput extends QueryOutput {
    user?: User;
}