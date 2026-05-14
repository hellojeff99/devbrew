import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCoffeeChatDto } from './dto/create_coffeechat.dto';
import { CoffeechatsService } from './coffeechats.service';

type AuthRequest = Request & {
  user: {
    sub: number;
    role: string;
  };
};

@Controller('coffeechats')
export class CoffeechatsController {
  constructor(private readonly coffeechatsService: CoffeechatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: AuthRequest, @Body() dto: CreateCoffeeChatDto) {
    return this.coffeechatsService.createCoffeeChat({
      timeSlotId: dto.timeSlotId,
      menteeId: req.user.sub,
    });
  }
}
