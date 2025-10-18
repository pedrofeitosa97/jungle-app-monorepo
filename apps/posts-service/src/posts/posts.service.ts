import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createPost(
    authorId: string,
    title: string,
    content: string,
  ): Promise<Post> {
    const post = this.postRepository.create({ authorId, title, content });
    return this.postRepository.save(post);
  }

  async listPosts(): Promise<Post[]> {
    return this.postRepository.find({ relations: ['comments'] });
  }

  async findPostById(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['comments'],
    });
    if (!post) throw new NotFoundException(`Post with id ${id} not found`);
    return post;
  }

  async findPostsByAuthorId(authorId: string): Promise<Post[]> {
    return this.postRepository.find({
      where: { authorId },
      relations: ['comments'],
    });
  }

  async addComment(
    postId: string,
    authorId: string,
    content: string,
  ): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException(`Post with id ${postId} not found`);

    const comment = this.commentRepository.create({ post, authorId, content });
    return this.commentRepository.save(comment);
  }
}
