import { Column, Entity } from "typeorm";
import { IsEmail, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/common.entity";

@Entity()
export class User extends CoreEntity {
    @Column()
    @IsEmail()
    @IsString()
    email: string;
    
    @Column()
    @IsString()
    userId:string;
}