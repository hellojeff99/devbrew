import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRoomGuard } from './chat.guard';
import { ChatService } from './chat.service';

@Module({
  imports: [JwtModule],
  controllers: [ChatController],
  providers: [ChatService, ChatRoomGuard, ChatGateway],
  exports: [ChatService, ChatRoomGuard],
})
export class ChatModule {}
