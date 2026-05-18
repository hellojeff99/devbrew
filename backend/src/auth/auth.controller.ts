import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import type { Request } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { LoginResDto } from './dto/login-res.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

type AuthenticatedRequest = Request & {
  user: {
    sub: number;
    role: string;
  };
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto): Promise<User> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{
    accessToken: string;
    user: LoginResDto;
  }> {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}
