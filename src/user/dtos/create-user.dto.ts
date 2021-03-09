import { QueryOutput } from "src/common/dtos/output.dto";

export class CreateUserInput{
  email:string
  userId:string;
}

export class CreateUserOutput extends QueryOutput{}