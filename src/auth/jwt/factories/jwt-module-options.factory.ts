import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';

@Injectable()
export class JwtModuleOptionsFactory implements JwtOptionsFactory {
  constructor(private readonly appConfigService: AppConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.appConfigService.get<string>(ENV_KEY.JWT_SECRET_KEY),
      signOptions: { expiresIn: '60s' },
    };
  }
}
