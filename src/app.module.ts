import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { AdminsModule } from '@src/admins/admins.module';
import { ReportsModule } from '@src/reports/reports.module';
import { AuthModule } from '@src/auth/auth.module';
import { BoardsModule } from '@src/boards/boards.module';
import { CategoryModule } from '@src/category/category.module';
import { ChatModule } from '@src/chat/chat.module';
import { CommentModule } from '@src/comments/comment.module';
import { RedisModule } from '@src/common/redis/redis.module';
import { S3Module } from '@src/common/s3/s3.module';
import { ExceptionsModule } from '@src/http-exceptions/exceptions.module';
import { MentorsModule } from '@src/mentors/mentors.module';
import { LoggerMiddleware } from '@src/middlewares/logger.middleware';
import { SearchModule } from '@src/search/search.module';
import { UserModule } from '@src/users/user.module';
import { CoreModule } from '@src/core/core.module';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { BootstrapService } from '@src/bootstrap.service';

@Module({
  imports: [
    RedisModule,
    AuthModule,
    CommentModule,
    UserModule,
    CoreModule,
    ChatModule,
    S3Module,
    BoardsModule,
    SearchModule,
    CategoryModule,
    MentorsModule,
    AdminsModule,
    ReportsModule,
    ExceptionsModule,
  ],
  providers: [BootstrapService],
})
export class AppModule implements NestModule {
  constructor(private readonly appConfigService: AppConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.appConfigService.isProduction() !== true);
  }
}
