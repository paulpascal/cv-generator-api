import { Module } from '@nestjs/common';
import { SkillsetService } from './skillset.service';
import { SkillsetController } from './skillset.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skillset } from './entities/skillset.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Skillset, User])],
  controllers: [SkillsetController],
  providers: [SkillsetService]
})
export class SkillsetModule {}
