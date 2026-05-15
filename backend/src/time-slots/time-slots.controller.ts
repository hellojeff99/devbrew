import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { JwtPayload } from '../auth/jwt.strategy';

type AuthRequest = Request & {
  user: JwtPayload;
};

@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createTimeSlot(@Req() request: AuthRequest, @Body() dto: CreateTimeSlotDto) {
    return this.timeSlotsService.createTimeSlot({
      mentorId: request.user.sub,
      startTime: dto.startTime,
    });
  }

  @Get(':mentorId')
  getMentorSlots(@Param('mentorId', ParseIntPipe) mentorId: number) {
    return this.timeSlotsService.getAvailableSlotsByMentorId(mentorId);
  }
}
