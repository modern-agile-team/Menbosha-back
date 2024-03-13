import { S3 } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { S3_CLIENT_TOKEN } from '@src/common/s3/constants/s3-client.token';
import { S3Service } from '@src/common/s3/services/s3.service';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';

@Module({
  providers: [
    {
      provide: S3_CLIENT_TOKEN,
      inject: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return new S3({
          region: appConfigService.get<string>(ENV_KEY.AWS_S3_REGION),
          credentials: {
            accessKeyId: appConfigService.get<string>(ENV_KEY.AWS_ACCESS_KEY),
            secretAccessKey: appConfigService.get<string>(
              ENV_KEY.AWS_SECRET_ACCESS_KEY,
            ),
          },
        });
      },
    },
    S3Service,
  ],
  exports: [S3Service],
})
export class S3Module {}
