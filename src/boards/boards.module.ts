import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpMeBoardController } from './controllers/help.me.boards.controller';
import { MentorBoardController } from './controllers/mentor.board.controller';
import { HelpMeBoardService } from './services/help.me.board.service';
import { MentorBoardService } from './services/mentor.board.service';
import { HelpMeBoard } from './entities/help-me-board.entity';
import { BoardImagesService } from './services/BoardImage.service';
import { S3Service } from 'src/common/s3/s3.service';
import { MentorBoard } from './entities/mentor-board.entity';
import { HelpMeBoardRepository } from './repository/help.me.board.repository';
import { MentorBoardRepository } from './repository/mentor.boards.repository';
import { BoardImageRepository } from './repository/boardImage.repository';
import { TokenService } from 'src/auth/services/token.service';
import { TokenRepository } from 'src/auth/repositories/token.repository';
import { HelpMeBoardImage } from './entities/help-me-board-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MentorBoard, HelpMeBoard, HelpMeBoardImage]),
  ],
  controllers: [MentorBoardController, HelpMeBoardController],
  providers: [
    HelpMeBoardService,
    MentorBoardService,
    BoardImagesService,
    S3Service,
    TokenService,
    BoardImageRepository,
    HelpMeBoardRepository,
    MentorBoardRepository,
    TokenRepository,
  ],
})
@Module({})
export class BoardsModule {}
