import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@src/auth/auth.module';
import { TotalCountModule } from '@src/total-count/total-count.module';
import { UserImageController } from '@src/users/controllers/user-image.controller';
import { UserController } from '@src/users/controllers/user.controller';
import { UserBadgeRepository } from '@src/users/repositories/user-badge.repository';
import { UserImageRepository } from '@src/users/repositories/user-image.repository';
import { UserIntroRepository } from '@src/users/repositories/user-intro.repository';
import { UserRankingRepository } from '@src/users/repositories/user-ranking.repository';
import { UserRepository } from '@src/users/repositories/user.repository';
import { UserBadgeService } from '@src/users/services/user-badge.service';
import { UserImageService } from '@src/users/services/user-image.service';
import { UserIntroService } from '@src/users/services/user-intro-service';
import { UserRankingService } from '@src/users/services/user-ranking.service';
import { UserService } from '@src/users/services/user.service';
import { User } from '@src/entities/User';
import { S3Module } from '@src/common/s3/s3.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    TotalCountModule,
    S3Module,
  ],
  controllers: [UserController, UserImageController],
  providers: [
    UserIntroService,
    UserRepository,
    UserImageRepository,
    UserService,
    UserImageService,
    UserBadgeService,
    UserBadgeRepository,
    UserIntroRepository,
    UserRankingService,
    UserRankingRepository,
  ],
  exports: [
    UserService,
    UserBadgeRepository,
    UserIntroRepository,
    UserIntroService,
    UserImageService,
    UserBadgeService,
    UserRankingService,
  ],
})
export class UserModule {}
