import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserImageController } from './controllers/user-image.controller';
import { S3Service } from 'src/common/s3/s3.service';
import { UserRepository } from './repositories/user.repository';
import { UserImageRepository } from './repositories/user-image.repository';
import { UserImageService } from './services/user-image.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserIntroService } from './services/user-intro-service';
import { UserBadgeRepository } from './repositories/user-badge.repository';
import { UserIntroRepository } from './repositories/user-intro.repository';
import { UserRankingService } from './services/user-ranking.service';
import { UserRankingRepository } from './repositories/user-ranking.repository';
import { TotalCountModule } from 'src/total-count/total-count.module';
import { UserBadgeService } from './services/user-badge.service';
import { UserReportsModule } from './user-reports/user-reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    TotalCountModule,
    UserReportsModule,
  ],
  controllers: [UserController, UserImageController],
  providers: [
    UserIntroService,
    S3Service,
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
