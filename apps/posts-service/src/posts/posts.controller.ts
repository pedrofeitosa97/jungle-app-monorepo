import {
  Body,
  Controller,
  Get,
  Param,
  Post as HttpPost,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @HttpPost()
  async createPost(@Body() dto: CreatePostDto) {
    return this.postsService.createPost(dto.authorId, dto.title, dto.content);
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

  @HttpPost(':id/comments')
  async addComment(@Param('id') postId: string, @Body() dto: CreateCommentDto) {
    return this.postsService.addComment(postId, dto.authorId, dto.content);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(id);
  }
}
