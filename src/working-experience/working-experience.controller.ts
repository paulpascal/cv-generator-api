import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { WorkingExperienceService } from './working-experience.service';
import { CreateWorkingExperienceInput } from './dto/create-working-experience.dto';
import { UpdateWorkingExperienceDto } from './dto/update-working-experience.dto';
import { Req, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('working-experience')
export class WorkingExperienceController {
  constructor(private readonly workingExperienceService: WorkingExperienceService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() request:RequestWithUser, @Body() createWorkingExperienceInput: CreateWorkingExperienceInput) {
    return this.workingExperienceService.create(request.user, createWorkingExperienceInput);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() request:RequestWithUser,) {
    return this.workingExperienceService.findAll(request.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Req() request:RequestWithUser,@Param('id') id: string) {
    return this.workingExperienceService.findOne(request.user,+id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Req() request:RequestWithUser,@Param('id') id: string, @Body() updateWorkingExperienceDto: UpdateWorkingExperienceDto) {
    return this.workingExperienceService.update(+id, updateWorkingExperienceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Req() request:RequestWithUser,@Param('id') id: string) {
    return this.workingExperienceService.remove(+id);
  }
}
