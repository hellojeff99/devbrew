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

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatRoomGuard } from './chat.guard';
import type { JwtPayload } from '../auth/jwt.strategy';
import { ChatService } from './chat.service';

type AuthRequest = Request & {
  user: JwtPayload;
};

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

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

  @Post(':roomId/message')
  @UseGuards(JwtAuthGuard, ChatRoomGuard)
  sendMessage(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Req() req: AuthRequest,
    @Body('content') content: string,
  ) {
    return this.chatService.createMessage(roomId, req.user.sub, content);
  }
}
