import {
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketGateway,
} from '@nestjs/websockets';

import { JwtService } from '@nestjs/jwt';

import type { Socket } from 'socket.io';

import { UnauthorizedException } from '@nestjs/common';

import type { JwtPayload } from '../auth/jwt.strategy';

type AuthenticatedSocket = Socket & {
  user: JwtPayload;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly jwtService: JwtService) {}

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
}
