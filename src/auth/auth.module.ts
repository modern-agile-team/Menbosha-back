import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { S3Service } from 'src/common/s3/s3.service';
import { TokenRepository } from './repositories/token.repository';
import { TokenService } from './services/token.service';
import { RedisModule } from 'src/common/redis/redis.module';
import { TotalCountModule } from 'src/total-count/total-count.module';
import { AccessTokenStrategy, RefreshTokenStrategy } from './jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/users/user.module';

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
