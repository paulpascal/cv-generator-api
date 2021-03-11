import { CoreEntity } from "src/common/entities/common.entity";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Education extends CoreEntity{
    @Column()
    @IsString()
    @IsNotEmpty()
    title: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    institute: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    startYear: string;
    
    @Column({nullable:true})
    endYear?: string;

    @ManyToOne(() => User, user => user.educations)
    user: User;

}
