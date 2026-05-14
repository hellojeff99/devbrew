import { Module } from '@nestjs/common';
import { CoffeechatsController } from './coffeechats.controller';
import { CoffeechatsService } from './coffeechats.service';

@Module({
  controllers: [CoffeechatsController],
  providers: [CoffeechatsService]
})
export class CoffeechatsModule {}
