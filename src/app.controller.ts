import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { RequestWithUser } from './common/interfaces/request-with-user.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getHello(@Req() request:RequestWithUser): string {
    console.log(request.user)
    return this.appService.getHello();
  }
}
