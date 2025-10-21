import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly gateway: NotificationsGateway) {}

  notifyAll(event: string, payload: any) {
    this.gateway.sendToAll(event, payload);
  }

  notifyUser(userId: string, event: string, payload: any) {
    this.gateway.sendToUser(userId, event, payload);
  }
}
