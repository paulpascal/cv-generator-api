import { CoreEntity } from "src/common/entities/common.entity";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Skillset extends CoreEntity{
    @Column()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Column("simple-array")
    @IsNotEmpty()
    skills: string;

    @ManyToOne(() => User, user => user.skillsets)
    user: User;
}
