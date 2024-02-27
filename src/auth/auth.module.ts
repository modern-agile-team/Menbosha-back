import { Module, forwardRef } from '@nestjs/common';
import { RedisModule } from '@src/common/redis/redis.module';
import { TotalCountModule } from '@src/total-count/total-count.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@src/users/user.module';
import { AuthController } from '@src/auth/controllers/auth.controller';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
} from '@src/auth/jwt/jwt.strategy';
import { TokenRepository } from '@src/auth/repositories/token.repository';
import { AuthService } from '@src/auth/services/auth.service';
import { TokenService } from '@src/auth/services/token.service';
import { S3Service } from '@src/common/s3/s3.service';
import { BannedUserModule } from '@src/admins/banned-user/banned-users.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    RedisModule,
    TotalCountModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '60s' },
    }),
    BannedUserModule,
  ],
  exports: [TokenService, TokenRepository],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    TokenRepository,
    S3Service,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
