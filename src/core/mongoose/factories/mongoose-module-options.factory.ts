import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';

@Injectable()
export class MongooseModuleOptionsFactory implements MongooseOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.appConfigService.get<string>(ENV_KEY.MONGO_URI),
    };
  }
}
