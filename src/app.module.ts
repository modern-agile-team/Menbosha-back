import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AdminsModule } from '@src/admins/admins.module';
import { ReportsModule } from '@src/reports/reports.module';
import { AuthModule } from '@src/auth/auth.module';
import { BoardsModule } from '@src/boards/boards.module';
import { CategoryModule } from '@src/category/category.module';
import { ChatModule } from '@src/chat/chat.module';
import { CommentModule } from '@src/comments/comment.module';
import { RedisModule } from '@src/common/redis/redis.module';
import { S3Module } from '@src/common/s3/s3.module';
import { S3Service } from '@src/common/s3/s3.service';
import { TypeORMconfig } from '@src/config/typeorm.config';
import { ExceptionsModule } from '@src/http-exceptions/exceptions.module';
import { MentorsModule } from '@src/mentors/mentors.module';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';
import { SearchModule } from '@src/search/search.module';
import { UserImageRepository } from '@src/users/repositories/user-image.repository';
import { UserImageService } from '@src/users/services/user-image.service';
import { UserModule } from '@src/users/user.module';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    CommentModule,
    UserModule,
    TypeOrmModule.forRoot({
      ...TypeORMconfig, // TypeORM 설정 객체 확장
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // .env 파일 경로 설정
    }),
    MongooseModule.forRoot(
      process.env.NODE_ENV === 'production'
        ? process.env.MONGO_URI
        : process.env.MONGO_URI_DEV,
    ),
    ScheduleModule.forRoot(),
    ChatModule,
    S3Module,
    BoardsModule,
    SearchModule,
    CategoryModule,
    MentorsModule,
    AdminsModule,
    ReportsModule,
    ExceptionsModule,
  ], //
  providers: [UserImageService, UserImageRepository, S3Service],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean =
    process.env.NODE_ENV === 'production' ? false : true;
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
