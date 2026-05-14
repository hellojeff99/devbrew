import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { MentorsModule } from './mentors/mentors.module';
import { TimeSlotsModule } from './time-slots/time-slots.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    MentorsModule,
    TimeSlotsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
