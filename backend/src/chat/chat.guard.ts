import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import type { Request } from 'express';
import type { JwtPayload } from '../auth/jwt.strategy';

import { ChatService } from './chat.service';

type AuthRequest = Request & {
  user: JwtPayload;
};

@Injectable()
export class ChatRoomGuard implements CanActivate {
  constructor(private readonly chatService: ChatService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();

    const userId = req.user.sub;

    const roomIdRaw = req.params.roomId ?? req.params.id;

    const roomId = Number(roomIdRaw);

    if (Number.isNaN(roomId)) {
      return false;
    }

    await this.chatService.validateRoomAccess(roomId, userId);

    return true;
  }
}
