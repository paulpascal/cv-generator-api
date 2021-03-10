import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProfileInput, CreateProfileOutput } from './dtos/create-profile.dto';
import { GetProfileOutput } from './dtos/get-profile.dto';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
    constructor(
     @InjectRepository(Profile)
     private readonly profiles: Repository<Profile>,
     @InjectRepository(User)
     private readonly users: Repository<User>
    ){}

    async createProfile(user:User, createProfileInput:CreateProfileInput):Promise<CreateProfileOutput>{
       try{  
           if(user.profile){
               return {ok: false, error:"User already has a profile"}
            }
            await this.profiles.save(this.profiles.create({...createProfileInput, user}))  
            return {ok: true}       
       }catch{
           return {ok: false, error: "Cannot create profile"}
       }
    }

    async getProfile(user:User):Promise<GetProfileOutput>{
        try{
            const {profile} = await this.users.findOne({id:user.id}, {relations: ['profile']})
            if(!profile){
                return {ok: false, error: "Profile not found"}
            }
            return {ok: true, profile}
        }catch{
            return {ok: false, error: "Cannot get profile"}
        }
    }
}
