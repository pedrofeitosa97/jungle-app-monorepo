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
    return this.postsService.createPost(authorId, title, content);
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
      if (err instanceof Error) throw new NotFoundException(err.message);
      throw new NotFoundException(String(err));
    }
  }

  @HttpPost(':id/like')
  async likePost(@Param('id') postId: string, @Body('userId') userId: string) {
    return this.postsService.likePost(postId, userId);
  }
}
