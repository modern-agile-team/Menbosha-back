import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@src/common/redis/redis.module';
import { AuthModule } from '@src/auth/auth.module';
import { CommentsController } from '@src/comments/controllers/comments.controller';
import { HelpYouComment } from '@src/comments/entities/help-you-comment.entity';
import { CommentsRepository } from '@src/comments/repository/comments.repository';
import { CommentsService } from '@src/comments/services/comments.services';
import { BoardsModule } from '@src/boards/boards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HelpYouComment]),
    RedisModule,
    AuthModule,
    BoardsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
})
export class CommentModule {}
