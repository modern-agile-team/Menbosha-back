import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import { S3Service } from 'src/common/s3/s3.service';
import { UserImageRepository } from 'src/users/repositories/user-image.repository';
import { TokenRepository } from './repositories/token.repository';
import { TokenService } from './services/token.service';
import { RedisModule } from 'src/common/redis/redis.module';
import { TotalCountModule } from 'src/total-count/total-count.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    RedisModule,
    TotalCountModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  exports: [TokenService, TokenRepository],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    UserRepository,
    UserImageRepository,
    TokenRepository,
    S3Service,
    JwtStrategy,
  ],
})
export class AuthModule {}
