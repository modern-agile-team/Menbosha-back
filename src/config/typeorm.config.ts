import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Token } from 'src/auth/entities/token.entity';
import { HelpMeBoardImage } from 'src/boards/entities/help-me-board-image.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { HelpYouComment } from 'src/comments/entities/help-you-comment.entity';
import { UserImage } from 'src/users/entities/user-image.entity';
import { User } from 'src/users/entities/user.entity';

// .env 파일 로드
dotenv.config();

export const TypeORMconfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    User,
    UserImage,
    Token,
    MentorBoard,
    HelpMeBoard,
    HelpMeBoardImage,
    HelpYouComment,
  ], // 여기에 엔티티들을 추가해야 합니다.
  synchronize: process.env.NODE_ENV === 'false',
};
