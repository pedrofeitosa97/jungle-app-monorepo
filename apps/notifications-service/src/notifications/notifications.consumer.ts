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
    this.gateway.sendToAll('postCreated', msg);
    this.gateway.sendToAll('posts.refresh', { postId: msg.postId });
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.liked',
    queue: 'notifications_post_liked',
  })
  handlePostLiked(msg: { authorId: string; likedBy: string; postId: string }) {
    this.gateway.sendToUser(msg.authorId, 'postLiked', msg);
    this.gateway.sendToAll('posts.refresh', { postId: msg.postId });
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.unliked',
    queue: 'notifications_post_unliked',
  })
  handlePostUnliked(msg: {
    authorId: string;
    unlikedBy: string;
    postId: string;
  }) {
    this.gateway.sendToUser(msg.authorId, 'postUnliked', msg);
    this.gateway.sendToAll('posts.refresh', { postId: msg.postId });
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'comment.added',
    queue: 'notifications_comment_added',
  })
  handleCommentAdded(msg: {
    postId: string;
    postAuthorId: string;
    authorId: string;
    content: string;
  }) {
    this.gateway.sendToUser(msg.postAuthorId, 'comment.added', msg);
    this.gateway.sendToAll('posts.refresh', { postId: msg.postId });
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.deleted',
    queue: 'notifications_post_deleted',
  })
  handlePostDeleted(msg: { postId: string }) {
    this.gateway.sendToAll('postDeleted', msg);
    this.gateway.sendToAll('posts.refresh', { postId: msg.postId });
  }

  @RabbitSubscribe({
    exchange: 'posts',
    routingKey: 'post.updated',
    queue: 'notifications_post_updated',
  })
  handlePostUpdated(msg: { postId: string; reason: string }) {
    this.gateway.sendToAll('posts.refresh', { postId: msg.postId });
  }
}
