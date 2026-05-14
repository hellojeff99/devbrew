import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

import { SignupDto } from './dto/signup.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

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
}
