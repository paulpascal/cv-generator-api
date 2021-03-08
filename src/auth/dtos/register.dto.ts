import { QueryOutput } from "src/common/dtos/output.dto";

export class AuthRegisterInput{
  email: string;
  password: string;
  name: string;
}

export class AuthRegisterOutput extends QueryOutput{
}