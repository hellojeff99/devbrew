import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { JwtService } from '@nestjs/jwt';

import type { Socket } from 'socket.io';

import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import type { JwtPayload } from '../auth/jwt.strategy';
import { ChatService } from './chat.service';

type AuthenticatedSocket = Socket & {
  user: JwtPayload;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(
    @ConnectedSocket()
    client: AuthenticatedSocket,
  ) {
    const token = (client.handshake.auth as { token?: string }).token;

    if (!token) {
      client.disconnect();

      throw new UnauthorizedException('Token required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });

      client.user = payload;
    } catch {
      client.disconnect();

      throw new UnauthorizedException('Invalid token');
    }
  }

  @SubscribeMessage('join_room')
  async handleJoinRoom(
    @ConnectedSocket()
    client: AuthenticatedSocket,

    @MessageBody()
    payload: {
      roomId: number;
    },
  ) {
    const { roomId } = payload;

    if (!roomId) {
      throw new ForbiddenException('RoomId required');
    }

    await this.chatService.validateRoomAccess(roomId, client.user.sub);

    await client.join(`room:${roomId}`);

    return {
      success: true,
      roomId,
    };
  }
}
