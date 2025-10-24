import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsConsumer {
  constructor(private readonly gateway: NotificationsGateway) {}

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.created',
    queue: 'notifications_post_created',
  })
  handlePostCreated(msg: { title: string; authorId: string; postId: string }) {
    console.log('post.created recebido:', msg);
    this.gateway.sendToAll('postCreated', msg);
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.liked',
    queue: 'notifications_post_liked',
  })
  handlePostLiked(msg: { authorId: string; likedBy: string; postId: string }) {
    console.log('post.liked recebido:', msg);
    this.gateway.sendToUser(msg.authorId, 'postLiked', msg);
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'comment.added',
    queue: 'notifications_comment_added',
  })
  handleCommentAdded(msg: {
    postId: string;
    authorId: string;
    content: string;
  }) {
    console.log('comment.added recebido:', msg);
    this.gateway.sendToUser(msg.authorId, 'comment_added', msg);
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.deleted',
    queue: 'notifications_post_deleted',
  })
  handlePostDeleted(msg: { postId: string }) {
    console.log('post.deleted recebido:', msg);
    this.gateway.sendToAll('postDeleted', msg);
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.unliked',
    queue: 'notifications_post_unliked',
  })
  handlePostUnliked(msg: { authorId: string; [key: string]: any }) {
    console.log('post.unliked recebido:', msg);
    this.gateway.sendToUser(msg.authorId, 'postUnliked', msg);
  }
}
