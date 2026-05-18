import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginResDto } from './dto/login-res.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const existingUser = await this.usersService.findByEmail(signupDto.email);

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    return this.usersService.create({
      email: signupDto.email,
      password: hashedPassword,
      name: signupDto.name,
      role: signupDto.role,
      techStack: [],
    });
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: LoginResDto }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // auth.service.ts — signAsync payload에 name 추가
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      role: user.role,
      name: user.name,
    });

    const loginResDto: LoginResDto = {
      id: user.id,
      role: user.role,
      name: user.name,
    };

    return { accessToken, user: loginResDto };
  }
}
