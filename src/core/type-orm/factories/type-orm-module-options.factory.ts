import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';

@Injectable()
export class TypeOrmModuleOptionsFactory implements TypeOrmOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.appConfigService.get<string>(ENV_KEY.DATABASE_HOST),
      port: this.appConfigService.get<number>(ENV_KEY.DATABASE_PORT),
      username: this.appConfigService.get<string>(ENV_KEY.DATABASE_USER),
      password: this.appConfigService.get<string>(ENV_KEY.DATABASE_PASSWORD),
      database: this.appConfigService.get<string>(ENV_KEY.DATABASE_NAME),
      entities: ['dist/**/entities/*{.ts,.js}'],
      subscribers: ['dist/**/subscribers/*{.ts,.js}'],
      timezone: '+00:00',
      synchronize: false, // DB 동기화 여부 설정
      logging: true, //DB 로깅 여부 설정
    };
  }
}
