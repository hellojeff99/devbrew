import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { JwtPayload } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatRoomDto } from './chat-room.dto';
import { ChatService } from './chat.service';

type AuthRequest = Request & {
  user: JwtPayload;
};

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChatRooms(
    @Req() req: AuthRequest,
  ): Promise<{ chatRooms: ChatRoomDto[] }> {
    const chatRooms = await this.chatService.getChatRoomsForUser(
      req.user.sub,
      req.user.role,
    );
    return { chatRooms };
  }

  @Get(':roomId/messages')
  async getMessages(@Param('roomId', ParseIntPipe) roomId: number) {
    return this.chatService.getMessages(roomId);
  }
}
