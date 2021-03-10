import { QueryOutput } from "src/common/dtos/output.dto";
import { User } from "../entities/user.entity";

export class FindByUserIdInput{
    userId:string;
}

export class FindByUserIdOutput extends QueryOutput{
    user?: User;
}