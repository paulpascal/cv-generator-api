import { OmitType } from "@nestjs/mapped-types";
import { QueryOutput } from "src/common/dtos/output.dto";
import { Profile } from "../entities/profile.entity";

export class CreateProfileInput extends OmitType(Profile, ["user"]) {}

export class CreateProfileOutput extends QueryOutput {}