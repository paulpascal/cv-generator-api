import { IsNotEmpty, IsString } from "class-validator";
import { CoreEntity } from "src/common/entities/common.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne } from "typeorm";

@Entity()
export class Profile extends CoreEntity {
    @Column()
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @Column()
    @IsString()
    email?: string;
  
    @Column()
    @IsString()
    phone?: string;
  
    @Column()
    @IsString()
    website?: string;
    
    @Column()
    @IsString()
    biography?: string;

    @Column()
    @IsString()
    @IsNotEmpty()
    workTitle: string;

    @Column()
    @IsString()
    photoUrl?: string;

    @OneToOne(()=>User, user=>user.profile)
    user: User
}