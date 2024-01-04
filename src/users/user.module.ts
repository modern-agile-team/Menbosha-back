import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserImageController } from './controllers/user-image.controller';
import { S3Service } from 'src/common/s3/s3.service';
import { UserRepository } from './repositories/user.repository';
import { UserImageRepository } from './repositories/user-image.repository';
import { UserImageService } from './services/user-image.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserIntroRepository } from './repositories/user-intro-repositories';
import { UserIntroService } from './services/user-intro-service';
import { UserBadgeRepository } from './repositories/user-badge.repository';
import { UserIntroRepository } from './repositories/user-intro.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UserController, UserImageController],
  providers: [
    UserIntroService,
    UserIntroRepository,
    S3Service,
    UserRepository,
    UserImageRepository,
    UserService,
    UserImageService,
    UserBadgeRepository,
    UserIntroRepository,
  ],
  exports: [UserService, UserRepository],
})
export class UserModule {}
