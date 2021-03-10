import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { WorkingExperienceService } from './working-experience.service';
import { CreateWorkingExperienceDto } from './dto/create-working-experience.dto';
import { UpdateWorkingExperienceDto } from './dto/update-working-experience.dto';

@Controller('working-experience')
export class WorkingExperienceController {
  constructor(private readonly workingExperienceService: WorkingExperienceService) {}

  @Post()
  create(@Body() createWorkingExperienceDto: CreateWorkingExperienceDto) {
    return this.workingExperienceService.create(createWorkingExperienceDto);
  }

  @Get()
  findAll() {
    return this.workingExperienceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workingExperienceService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateWorkingExperienceDto: UpdateWorkingExperienceDto) {
    return this.workingExperienceService.update(+id, updateWorkingExperienceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workingExperienceService.remove(+id);
  }
}
