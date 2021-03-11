import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { User } from 'src/user/entities/user.entity';
import { CreateProfileInput, CreateProfileOutput } from './dtos/create-profile.dto';
import { GetCompleteUserProfileOutput } from './dtos/get-complete-user-profile.dto';
import { GetProfileOutput } from './dtos/get-profile.dto';
import { UpdateProfileInput, UpdateProfileOutput } from './dtos/update-profile';
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

    @Patch('/')
    @UseGuards(AuthGuard('jwt'))
    updateProfile(@Req() request:RequestWithUser,  @Body() profile:UpdateProfileInput):Promise<UpdateProfileOutput>{
      return this.profileService.updateProfile(request.user,profile)
    }

    @Get('/complete-profile')
    @UseGuards(AuthGuard('jwt'))
    getCompleteUserProfile(@Req() request:RequestWithUser):Promise<GetCompleteUserProfileOutput>{
      return this.profileService.getCompleteUserProfile(request.user)
    }

}
