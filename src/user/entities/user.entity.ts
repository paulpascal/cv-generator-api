import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { IsEmail, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/common.entity";
import { Profile } from "src/profile/entities/profile.entity";

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
}