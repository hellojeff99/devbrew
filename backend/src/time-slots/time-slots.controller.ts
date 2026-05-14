import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { TimeSlotsService } from './time-slots.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTimeSlotDto } from './dto/create-time-slot.dto';
import { JwtPayload } from '../auth/jwt.strategy';

type AuthenticatedRequest = Request & {
  user: JwtPayload;
};

@Controller('time-slots')
export class TimeSlotsController {
  constructor(private readonly timeSlotsService: TimeSlotsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  craeteTimeSlot(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateTimeSlotDto,
  ) {
    return this.timeSlotsService.createTimeSlot({
      mentorId: request.user.sub,
      startTime: dto.startTime,
    });
  }
}
