import { Module } from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatRoomGuard } from './chat.guard';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatRoomGuard],
  exports: [ChatService, ChatRoomGuard],
})
export class ChatModule {}
