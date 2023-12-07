import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './controllers/mentor.boards.controller';
import { BoardsService } from './services/mentor.board.service';
import { HelpMeBoard } from './entities/help-me-board.entity';
import { BoardImagesService } from './services/BoardImage.service';
import { S3Service } from 'src/common/s3/s3.service';
import { MentorBoard } from './entities/mentor-board.entity';
import { BoardRepository } from './repository/boards.repository';
import { BoardImageRepository } from './repository/boardImage.repository';
import { TokenService } from 'src/auth/services/token.service';
import { TokenRepository } from 'src/auth/repositories/token.repository';
import { HelpMeBoardImage } from './entities/help-me-board-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorBoard, HelpMeBoard, HelpMeBoardImage]),
  ],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    BoardImagesService,
    S3Service,
    TokenService,
    BoardRepository,
    BoardImageRepository,
    TokenRepository,
  ],
})
@Module({})
export class BoardsModule {}
