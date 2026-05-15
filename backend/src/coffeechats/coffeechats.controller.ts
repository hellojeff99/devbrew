import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCoffeeChatDto } from './dto/create_coffeechat.dto';
import { CoffeeChatsService } from './coffeechats.service';

type AuthRequest = Request & {
  user: {
    sub: number;
    role: string;
  };
};

@Controller('coffeechats')
export class CoffeeChatsController {
  constructor(private readonly coffeeChatsService: CoffeeChatsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: AuthRequest, @Body() dto: CreateCoffeeChatDto) {
    return this.coffeeChatsService.createCoffeeChat({
      timeSlotId: dto.timeSlotId,
      menteeId: req.user.sub,
    });
  }

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard)
  approve(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) coffeeChatId: number,
  ) {
    return this.coffeeChatsService.approveCoffeeChat(
      coffeeChatId,
      req.user.sub,
    );
  }

  @Patch(':id/reject')
  @UseGuards(JwtAuthGuard)
  reject(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.coffeeChatsService.rejectCoffeeChat(id, req.user.sub);
  }
}
