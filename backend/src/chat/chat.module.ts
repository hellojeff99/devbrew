import { Module } from '@nestjs/common';

import { ChatService } from './chat.service';
import { ChatRoomGuard } from './chat.guard';

@Module({
  providers: [ChatService, ChatRoomGuard],
  exports: [ChatService, ChatRoomGuard],
})
export class ChatModule {}
