import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async createPost(
    authorId: string,
    title: string,
    content: string,
  ): Promise<Post> {
    const post = this.postRepository.create({ authorId, title, content });
    const saved = await this.postRepository.save(post);
    await this.amqpConnection.publish('posts', 'post.created', {
      postId: saved.id,
      authorId,
      title,
    });
    return saved;
  }

  async likePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    post.likes = (post.likes || 0) + 1;
    await this.postRepository.save(post);
    await this.amqpConnection.publish('posts', 'post.liked', {
      postId,
      likedBy: userId,
      authorId: post.authorId,
    });
    return post;
  }

  async listPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }

  async findPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return post;
  }
}
