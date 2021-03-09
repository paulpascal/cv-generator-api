import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput, CreateUserOutput } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private users: Repository<User>
    ){}

    async createUser({email, userId}:CreateUserInput): Promise<CreateUserOutput>{
        try{
            const exists = await this.users.findOne({email})
            if(!!exists){
                return {ok: false, error:"Email already exists"}
            }
            await this.users.save(this.users.create({email, userId}))
            return {ok: true}
        }catch{
            return {ok: false, error:"Cannot create an account"}
        }
    }
}
