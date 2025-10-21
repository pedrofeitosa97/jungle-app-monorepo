import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: () => ({
        exchanges: [{ name: 'posts', type: 'topic' }],
        uri: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
        connectionInitOptions: { wait: true },
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
