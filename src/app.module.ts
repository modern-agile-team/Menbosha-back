import { RedisModule } from './common/redis/redis.module';
import { UserImageService } from './users/services/user-image.service';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comments/comment.module';
import { UserModule } from './users/user.module';
import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeORMconfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';
import { S3Module } from './common/s3/s3.module';
import { S3Service } from './common/s3/s3.service';
import { BoardsModule } from './boards/boards.module';
import * as mongoose from 'mongoose';
import { UserImageRepository } from './users/repositories/user-image.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { SearchModule } from './search/search.module';
import { ExceptionsModule } from './http-exceptions/exceptions.module';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    CommentModule,
    UserModule,
    TypeOrmModule.forRoot({
      ...TypeORMconfig, // TypeORM 설정 객체 확장
      synchronize: true, // DB 동기화 여부 설정
      logging: false, //DB 로깅 여부 설정
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // .env 파일 경로 설정
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    ScheduleModule.forRoot(),
    ChatModule,
    S3Module,
    BoardsModule,
    SearchModule,
    ExceptionsModule,
  ], //
  providers: [UserImageService, UserImageRepository, S3Service],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean =
    process.env.NODE_ENV === 'dev' ? true : false;
  configure() {
    mongoose.set('debug', this.isDev);
  }
}
