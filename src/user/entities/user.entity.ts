import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { IsEmail, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/common.entity";
import { Profile } from "src/profile/entities/profile.entity";
import { WorkingExperience } from "src/working-experience/entities/working-experience.entity";

@Entity()
export class User extends CoreEntity {
    @Column()
    @IsEmail()
    @IsString()
    email: string;
    
    @Column()
    @IsString()
    userId:string;

    @OneToOne(()=>Profile, profile=> profile.user, { eager:true})
    @JoinColumn()
    profile: Profile

    @JoinColumn()
    @OneToMany(() => WorkingExperience, workingExperience => workingExperience.user)
    workingExperiences: WorkingExperience[]
}