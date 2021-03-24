import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { CreateSkillsetInput, CreateSkillsetOutput } from './dto/create-skillset.dto';
import { FindSkillsetOutput } from './dto/find-skillset.dto';
import { GetAllSkillsetsOutput } from './dto/get-all-skillsets.dto';
import { RemoveSkillsetOutput } from './dto/remove-skillset.dto';
import { UpdateSkillsetInput, UpdateSkillsetOutput } from './dto/update-skillset.dto';
import { SkillsetService } from './skillset.service';


@Controller('skillset')
export class SkillsetController {
  constructor(private readonly skillsets: SkillsetService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Req() request:RequestWithUser, @Body() createSkillsetInput: CreateSkillsetInput): Promise<CreateSkillsetOutput> {
    return this.skillsets.create(request.user, createSkillsetInput);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() request:RequestWithUser): Promise<GetAllSkillsetsOutput> {
    return this.skillsets.findAll(request.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Req() request:RequestWithUser, @Param('id') id: string): Promise<FindSkillsetOutput> {
    return this.skillsets.findOne(request.user, +id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Req() request:RequestWithUser, @Param('id') id: string, @Body() updateSkillsetInput: UpdateSkillsetInput): Promise<UpdateSkillsetOutput> {
    return this.skillsets.update(request.user, +id, updateSkillsetInput);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Req() request:RequestWithUser, @Param('id') id: string): Promise<RemoveSkillsetOutput> {
    return this.skillsets.remove(request.user, +id);
  }
}
