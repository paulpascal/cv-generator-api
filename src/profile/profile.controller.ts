import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { CreateProfileInput, CreateProfileOutput } from './dtos/create-profile.dto';
import { GetProfileOutput } from './dtos/get-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService){}

    @Post('/')
    @UseGuards(AuthGuard('jwt'))
    createProfile(@Req() request:RequestWithUser, @Body() profile:CreateProfileInput):Promise<CreateProfileOutput>{
      return this.profileService.createProfile(request.user, profile)
    }
    
    @Get('/')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@Req() request:RequestWithUser):Promise<GetProfileOutput>{
      return this.profileService.getProfile(request.user)
    }

}
