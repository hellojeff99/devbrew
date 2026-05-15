import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

import { ChatRoomGuard } from './chat.guard';

@Controller('chat')
export class ChatController {
  @Get('test/:roomId')
  @UseGuards(JwtAuthGuard, ChatRoomGuard)
  testAccess(
    @Param('roomId', ParseIntPipe)
    roomId: number,
  ) {
    return {
      ok: true,
      roomId,
      message: 'Access granted',
    };
  }
}
