import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateWorkingExperienceInput, CreateWorkingExperienceOutput } from './dto/create-working-experience.dto';
import { GetAllWorkingExperiencesOutput } from './dto/get-all-working-experiences.dto';
import { UpdateWorkingExperienceDto } from './dto/update-working-experience.dto';
import { WorkingExperience } from './entities/working-experience.entity';

@Injectable()
export class WorkingExperienceService {
  constructor(
    @InjectRepository(WorkingExperience)
    private readonly workingExperience: Repository<WorkingExperience>,
    @InjectRepository(User)
    private readonly users: Repository<User>
  ){

  }

  async create(user:User,createWorkingExperienceInput: CreateWorkingExperienceInput): Promise<CreateWorkingExperienceOutput>{
    try{
      await this.workingExperience.save(this.workingExperience.create({...createWorkingExperienceInput, user}))  
      return {ok: true}
    }catch{
      return {ok: false, error:"Cannot create working experience"}
    }
  }

  async findAll(user:User): Promise<GetAllWorkingExperiencesOutput> {
    try{
      const userWithRel = await this.users.findOne({id:user.id}, {relations: ['workingExperiences']})  
      return {ok: true,workingExperiences: userWithRel.workingExperiences }
    }catch{
      return {ok: false, error:"Cannot create working experience"}
    }
  }

  async findOne(user:User, id: number) {
    try{
      const workingExperience = await this.workingExperience.findOne({id}, {relations: ['user']})
      if(user.id !== workingExperience.user.id){
        return {ok: false, error:"Permission denied"}
      }
      return {ok: true,workingExperience }
    }catch{
      return {ok: false, error:"Cannot create working experience"}
    }
  }

  update(id: number, updateWorkingExperienceDto: UpdateWorkingExperienceDto) {
    return `This action updates a #${id} workingExperience`;
  }

  remove(id: number) {
    return `This action removes a #${id} workingExperience`;
  }
}
