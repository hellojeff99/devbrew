import { Module } from '@nestjs/common';
import { CoffeeChatsController } from './coffeechats.controller';
import { CoffeeChatsService } from './coffeechats.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [CoffeeChatsController],
  providers: [CoffeeChatsService],
})
export class CoffeeChatsModule {}
