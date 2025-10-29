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
        uri: process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672',
        connectionInitOptions: { wait: true, timeout: 15000 },
      }),
    }),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
