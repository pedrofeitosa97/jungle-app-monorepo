import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsConsumer {
  constructor(private readonly gateway: NotificationsGateway) {}

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.created',
    queue: 'notifications_post_created',
  })
  handlePostCreated(msg: any) {
    console.log('post.created recebido:', msg);
    this.gateway.sendToAll('postCreated', msg);
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.liked',
    queue: 'notifications_post_liked',
  })
  handlePostLiked(msg: { authorId: string; [key: string]: any }) {
    console.log('post.liked recebido:', msg);
    this.gateway.sendToUser(msg.authorId, 'postLiked', msg);
  }
}
