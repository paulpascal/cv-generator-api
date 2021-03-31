import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { EducationService } from './education.service';
import {
  UpdateEducationInput,
  UpdateEducationOutput,
} from './dto/update-education.dto';
import {
  CreateEducationInput,
  CreateEducationOutput,
} from './dto/create-education.dto';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { GetAllEducationsOutput } from './dto/get-all-educations.dto';
import { FindEducationOutput } from './dto/find-education.dto';
import { RemoveEducationOutput } from './dto/remove-education.dto';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Req() request: RequestWithUser,
    @Body() createEducationInput: CreateEducationInput,
  ): Promise<CreateEducationOutput> {
    return this.educationService.create(request.user, createEducationInput);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() request: RequestWithUser): Promise<GetAllEducationsOutput> {
    return this.educationService.findAll(request.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ): Promise<FindEducationOutput> {
    return this.educationService.findOne(request.user, +id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
    @Body() updateEducationInput: UpdateEducationInput,
  ): Promise<UpdateEducationOutput> {
    return this.educationService.update(
      request.user,
      +id,
      updateEducationInput,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(
    @Req() request: RequestWithUser,
    @Param('id') id: string,
  ): Promise<RemoveEducationOutput> {
    return this.educationService.remove(request.user, +id);
  }
}
