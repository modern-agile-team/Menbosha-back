import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '@src/core/app-config/app-config.module';
import { MongooseModuleOptionsFactory } from '@src/core/mongoose/factories/mongoose-module-options.factory';
import { TypeOrmModuleOptionsFactory } from '@src/core/type-orm/factories/type-orm-module-options.factory';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmModuleOptionsFactory,
    }),
    MongooseModule.forRootAsync({
      useClass: MongooseModuleOptionsFactory,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [TypeOrmModuleOptionsFactory, MongooseModuleOptionsFactory],
})
export class CoreModule {}
