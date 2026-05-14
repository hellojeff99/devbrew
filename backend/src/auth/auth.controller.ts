import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto): Promise<User> {
    return this.authService.signup(signupDto);
  }
}
