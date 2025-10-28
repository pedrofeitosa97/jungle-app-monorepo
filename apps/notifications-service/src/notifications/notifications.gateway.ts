import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface AuthPayload {
  userId?: string;
  token?: string;
}

@WebSocketGateway({ cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>();

  handleConnection(socket: Socket) {
    const auth = socket.handshake.auth as AuthPayload;
    const userId = auth?.userId;

    if (userId) {
      this.clients.set(userId, socket.id);
      socket.join(userId);
      console.log(`✅ Usuário conectado: ${userId} (${socket.id})`);
    } else {
      console.warn('⚠️ Conexão sem userId ignorada');
    }
  }

  handleDisconnect(socket: Socket) {
    const userId = [...this.clients.entries()].find(
      ([, id]) => id === socket.id,
    )?.[0];
    if (userId) {
      this.clients.delete(userId);
      socket.leave(userId);
      console.log(`❌ Usuário desconectado: ${userId}`);
    }
  }

  sendToAll(event: string, payload: unknown) {
    this.server.emit(event, payload);
  }

  sendToUser(userId: string, event: string, payload: unknown) {
    const socketId = this.clients.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, payload);
      console.log(`📩 Enviado para ${userId} (${socketId}) → ${event}`);
    } else {
      console.warn(`⚠️ Usuário ${userId} não está conectado`);
    }
  }
}
