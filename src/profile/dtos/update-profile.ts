import { OmitType, PartialType } from "@nestjs/mapped-types";
import { QueryOutput } from "src/common/dtos/output.dto";
import { Profile } from "../entities/profile.entity";

export class UpdateProfileInput extends PartialType(OmitType(Profile, ["user"])) {}

export class UpdateProfileOutput extends QueryOutput {
    profile?: Profile;
}