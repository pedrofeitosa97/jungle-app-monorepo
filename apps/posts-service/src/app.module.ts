import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [DatabaseModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
