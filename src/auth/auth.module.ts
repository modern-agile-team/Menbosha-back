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
import { BannedUserModule } from '@src/admins/banned-user/banned-users.module';
import { JwtModuleOptionsFactory } from '@src/auth/jwt/factories/jwt-module-options.factory';
import { S3Module } from '@src/common/s3/s3.module';
import { ChatModule } from '@src/chat/chat.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    RedisModule,
    TotalCountModule,
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtModuleOptionsFactory,
    }),
    BannedUserModule,
    S3Module,
    ChatModule,
  ],
  exports: [TokenService, TokenRepository],
  controllers: [AuthController],
  providers: [
    JwtModuleOptionsFactory,
    AuthService,
    TokenService,
    TokenRepository,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
