import { Controller, LiteralObject, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
// import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import RoleGuard from 'src/guards/role.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @MessagePattern({ role: 'auth', cmd: 'login'})
  async login(@Request() req:LiteralObject) {
    return this.authService.login(req.user);
  }

  //@UseGuards(JwtAuthGuard)
  @MessagePattern({ role: 'auth', cmd: 'check'})
  async loggedIn(data:LiteralObject) {
    try {
      return this.authService.validateToken(data.jwt);
    } catch(e) {
      Logger.log(e);
      return false;
    }
  }
  
  @UseGuards(RoleGuard(['admin']))
  @MessagePattern({ role: 'auth', cmd: 'hasRole'})
  async hasRole(data:LiteralObject) {
    try {
      return this.authService.validateToken(data.jwt);
    } catch(e) {
      Logger.log(e);
      return false;
    }
  }
}
