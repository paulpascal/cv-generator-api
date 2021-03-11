import { Module } from '@nestjs/common';
import { WorkingExperienceService } from './working-experience.service';
import { WorkingExperienceController } from './working-experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingExperience } from './entities/working-experience.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([WorkingExperience, User])],
  controllers: [WorkingExperienceController],
  providers: [WorkingExperienceService]
})
export class WorkingExperienceModule {}
