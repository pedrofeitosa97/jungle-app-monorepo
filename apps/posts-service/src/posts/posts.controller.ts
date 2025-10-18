import {
  Body,
  Controller,
  Get,
  Param,
  Post as HttpPost,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  async createPost(
    @Body('authorId') authorId: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    const post = await this.postsService.createPost(authorId, title, content);
    return post;
  }

  @Get()
  async listPosts() {
    return this.postsService.listPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    try {
      return await this.postsService.findPostById(id);
    } catch (err) {
      if (err instanceof Error) {
        throw new NotFoundException(err.message);
      }
      throw new NotFoundException(String(err));
    }
  }

  @Get('author/:authorId')
  async getPostsByAuthor(@Param('authorId') authorId: string) {
    return this.postsService.findPostsByAuthorId(authorId);
  }

  @HttpPost(':id/comments')
  async addComment(
    @Param('id') postId: string,
    @Body('authorId') authorId: string,
    @Body('content') content: string,
  ) {
    return this.postsService.addComment(postId, authorId, content);
  }
}
