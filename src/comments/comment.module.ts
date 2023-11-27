import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/help-you-comment.entity';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './services/comments.services';
import { TokenService } from 'src/auth/services/token.service';
import { CommentsRepository } from './repository/comments.repository';
import { TokenRepository } from 'src/auth/repositories/token.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    TokenService,
    TokenRepository,
  ],
})
export class CommentModule {}
