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
    const post: Post = this.postRepository.create({
      authorId,
      title,
      content,
      likedUsers: [],
    });

    const saved: Post = await this.postRepository.save(post);
    const postId = saved.id;

    await this.amqpConnection.publish('posts', 'post.created', {
      postId,
      authorId,
      title,
    });

    await this.amqpConnection.publish('posts', 'post.updated', {
      postId,
      reason: 'post.created',
    });

    return this.findPostById(postId);
  }

  async likePost(postId: string, userId: string): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    post.likedUsers = post.likedUsers || [];
    const hasLiked = post.likedUsers.includes(userId);

    if (hasLiked) {
      post.likes = Math.max(0, post.likes - 1);
      post.likedUsers = post.likedUsers.filter((u) => u !== userId);
      await this.postRepository.save(post);

      await this.amqpConnection.publish('posts', 'post.unliked', {
        postId,
        unlikedBy: userId,
        authorId: post.authorId,
      });
      await this.amqpConnection.publish('posts', 'post.updated', {
        postId,
        reason: 'post.unliked',
      });
    } else {
      post.likes++;
      post.likedUsers.push(userId);
      await this.postRepository.save(post);

      await this.amqpConnection.publish('posts', 'post.liked', {
        postId,
        likedBy: userId,
        authorId: post.authorId,
      });
      await this.amqpConnection.publish('posts', 'post.updated', {
        postId,
        reason: 'post.liked',
      });
    }

    return this.findPostById(postId);
  }

  async addComment(
    postId: string,
    authorId: string,
    content: string,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const comment: Comment = this.commentRepository.create({
      post,
      authorId,
      content,
      likedUsers: [],
    });

    const saved: Comment = await this.commentRepository.save(comment);

    await this.amqpConnection.publish('posts', 'comment.added', {
      postId,
      postAuthorId: post.authorId,
      authorId,
      content,
    });

    await this.amqpConnection.publish('posts', 'post.updated', {
      postId,
      reason: 'comment.added',
    });

    return saved;
  }

  async deletePost(id: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) throw new NotFoundException('Post not found');

    await this.postRepository.remove(post);
    await this.amqpConnection.publish('posts', 'post.deleted', { postId: id });
    await this.amqpConnection.publish('posts', 'post.updated', {
      postId: id,
      reason: 'post.deleted',
    });
  }

  async listPosts(): Promise<Post[]> {
    const posts = await this.postRepository.find({
      relations: ['comments'],
      order: { createdAt: 'DESC' },
    });
    return posts.map((p) => ({ ...p, likedUsers: p.likedUsers || [] }));
  }

  async findPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return { ...post, likedUsers: post.likedUsers || [] };
  }
}
