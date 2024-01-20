import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Token } from 'src/auth/entities/token.entity';
import { HelpMeBoardImage } from 'src/boards/entities/help-me-board-image.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { HelpYouComment } from 'src/comments/entities/help-you-comment.entity';
import { UserImage } from 'src/users/entities/user-image.entity';
import { User } from 'src/users/entities/user.entity';
import { CategoryList } from 'src/category/entity/category-list.entity';
import { BadgeList } from 'src/common/entity/badge-list.entity';
import { UserBadge } from 'src/users/entities/user-badge.entity';
import { MentorReview } from 'src/users/entities/mentor-review.entity';
import { UserIntro } from 'src/users/entities/user-intro.entity';
import { MentorBoardLike } from 'src/boards/entities/mentor-board-like.entity';
import { MentorBoardImage } from 'src/boards/entities/mentor-board-image.entity';
import { UserRanking } from 'src/users/entities/user-ranking.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import { DataSource } from 'typeorm';
import { MentorReviewChecklist } from 'src/users/entities/mentor-review-checklist.entity';

// .env 파일 로드
dotenv.config();

export default new DataSource({
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
    MentorBoardImage,
    HelpMeBoard,
    HelpMeBoardImage,
    HelpYouComment,
    CategoryList,
    BadgeList,
    UserBadge,
    MentorReview,
    MentorReviewChecklist,
    UserIntro,
    UserRanking,
    TotalCount,
    MentorBoardLike,
  ], // 여기에 엔티티들을 추가해야 합니다.
  migrationsTableName: 'migrations', // migration 이력을 저장하는 테이블
  migrations: ['migrations/*.ts'], // migration 할 파일들이 있는 directory
});

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
    MentorBoardImage,
    HelpMeBoard,
    HelpMeBoardImage,
    HelpYouComment,
    CategoryList,
    BadgeList,
    UserBadge,
    MentorReview,
    MentorReviewChecklist,
    UserIntro,
    UserRanking,
    TotalCount,
    MentorBoardLike,
  ], // 여기에 엔티티들을 추가해야 합니다.
  migrationsTableName: 'migrations', // migration 이력을 저장하는 테이블
  migrations: ['migrations/*.ts'], // migration 할 파일들이 있는 directory
  synchronize: process.env.NODE_ENV === 'true',
};
