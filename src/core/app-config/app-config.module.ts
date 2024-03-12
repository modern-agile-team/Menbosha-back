import { Global, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.*.env'],
      validationSchema: Joi.object({
        [ENV_KEY.PORT]: Joi.number().default(3000),
        [ENV_KEY.NODE_ENV]: Joi.string()
          .valid('local', 'development', 'production')
          .required(),

        [ENV_KEY.DATABASE_HOST]: Joi.string().required(),
        [ENV_KEY.DATABASE_PORT]: Joi.number().required(),
        [ENV_KEY.DATABASE_USER]: Joi.string().required(),
        [ENV_KEY.DATABASE_PASSWORD]: Joi.string().required(),
        [ENV_KEY.DATABASE_NAME]: Joi.string().required(),

        [ENV_KEY.MONGO_URI]: Joi.string().required(),

        [ENV_KEY.NAVER_CLIENT_ID]: Joi.string().required(),
        [ENV_KEY.NAVER_CLIENT_SECRET]: Joi.string().required(),
        [ENV_KEY.NAVER_REDIRECT_URI]: Joi.string().required(),

        [ENV_KEY.KAKAO_CLIENT_ID]: Joi.string().required(),
        [ENV_KEY.KAKAO_REDIRECT_URI]: Joi.string().required(),

        [ENV_KEY.GOOGLE_CLIENT_ID]: Joi.string().required(),
        [ENV_KEY.GOOGLE_CLIENT_SECRET]: Joi.string().required(),
        [ENV_KEY.GOOGLE_REDIRECT_URI]: Joi.string().required(),

        [ENV_KEY.JWT_SECRET_KEY]: Joi.string().required(),
        [ENV_KEY.JWT_ACCESS_TOKEN_SECRET_KEY]: Joi.string().required(),
        [ENV_KEY.JWT_REFRESH_TOKEN_SECRET_KEY]: Joi.string().required(),

        [ENV_KEY.AWS_S3_URL]: Joi.string().required(),
        [ENV_KEY.AWS_S3_BUCKET]: Joi.string().required(),
        [ENV_KEY.AWS_ACCESS_KEY]: Joi.string().required(),
        [ENV_KEY.AWS_SECRET_ACCESS_KEY]: Joi.string().required(),
        [ENV_KEY.AWS_S3_REGION]: Joi.string().required(),

        [ENV_KEY.DEFAULT_USER_IMAGE]: Joi.string().required(),

        [ENV_KEY.REDIS_PASSWORD]: Joi.string().required(),
        [ENV_KEY.REDIS_HOST]: Joi.string().required(),
        [ENV_KEY.REDIS_PORT]: Joi.number().required(),

        [ENV_KEY.FRONT_PRODUCTION_DOMAIN]: Joi.string().required(),
        [ENV_KEY.FRONT_PRODUCTION_WWW_DOMAIN]: Joi.string().required(),
        [ENV_KEY.FRONT_DEVELOPMENT_DOMAIN]: Joi.string().required(),
        [ENV_KEY.FRONT_DEVELOPMENT_WWW_DOMAIN]: Joi.string().required(),
        [ENV_KEY.FRONT_LOCAL_DOMAIN]: Joi.string().required(),
      }),
      isGlobal: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule implements OnApplicationBootstrap {
  constructor(private readonly appConfigService: AppConfigService) {}

  onApplicationBootstrap() {
    console.info(this.appConfigService.getAllMap());
  }
}
