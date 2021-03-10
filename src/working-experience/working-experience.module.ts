import { Module } from '@nestjs/common';
import { WorkingExperienceService } from './working-experience.service';
import { WorkingExperienceController } from './working-experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingExperience } from './entities/working-experience.entity';

@Module({
  imports:[TypeOrmModule.forFeature([WorkingExperience])],
  controllers: [WorkingExperienceController],
  providers: [WorkingExperienceService]
})
export class WorkingExperienceModule {}
