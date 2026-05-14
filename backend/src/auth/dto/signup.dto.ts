import { UserRole } from '@prisma/client';

export class SignupDto {
  email!: string;

  password!: string;

  name!: string;

  role!: UserRole;
}
