import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { IsEmail, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/common.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { WorkingExperience } from "src/working-experience/entities/working-experience.entity";
import { Education } from "src/education/entities/education.entity";
import { Skillset } from "src/skillset/entities/skillset.entity";

@Entity()
export class User extends CoreEntity {
    @Column()
    @IsEmail()
    @IsString()
    email: string;
    
    @Column()
    @IsString()
    userId:string;

    @OneToOne(()=>Profile, profile=> profile.user)
    @JoinColumn()
    profile: Profile

    @JoinColumn()
    @OneToMany(() => WorkingExperience, workingExperience => workingExperience.user)
    workingExperiences: WorkingExperience[]

    @JoinColumn()
    @OneToMany(() => Education, education => education.user)
    educations: Education[]

    @JoinColumn()
    @OneToMany(() => Skillset, skillset => skillset.user)
    skillsets: Skillset[]
}