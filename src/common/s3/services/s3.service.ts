import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3,
} from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3_CLIENT_TOKEN } from '@src/common/s3/constants/s3-client.token';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';

@Injectable()
export class S3Service {
  private readonly S3_BUCKET: string = this.appConfigService.get<string>(
    ENV_KEY.AWS_S3_BUCKET,
  );
  private readonly S3_REGION: string = this.appConfigService.get<string>(
    ENV_KEY.AWS_S3_REGION,
  );
  private readonly S3_ADDRESS: string = `https://${this.S3_BUCKET}.s3.${this.S3_REGION}.amazonaws.com/`;

  constructor(
    @Inject(S3_CLIENT_TOKEN)
    private readonly s3: S3,
    private readonly appConfigService: AppConfigService,
  ) {}

  async uploadImage(
    file,
    userId,
    folderName,
  ): Promise<{ url: string; key: string }> {
    const currentTime = new Date().getTime();
    const filename = `${folderName}/${userId}_${currentTime}.jpeg`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          ACL: 'public-read',
          Bucket: this.S3_BUCKET,
          Key: filename,
          Body: file.buffer,
          ContentType: 'image/jpeg',
          ContentDisposition: 'inline',
        }),
      );
      const fileUrl = `${this.S3_ADDRESS}${filename}`;

      return { url: fileUrl, key: filename };
    } catch (error) {
      console.error(error);
      throw new Error('S3 업로드 오류');
    }
  }

  async deleteImage(key: string): Promise<boolean> {
    const params = {
      Bucket: this.S3_BUCKET,
      Key: key,
    };

    try {
      await this.s3.send(new DeleteObjectCommand(params));
      return true; // 이미지 삭제 성공
    } catch (error) {
      console.error('S3 이미지 삭제 오류:', error);
      return false; // 이미지 삭제 실패
    }
  }

  async deleteImagesWithPrefix(prefix: string): Promise<boolean> {
    const listParams = {
      Bucket: this.S3_BUCKET,
      Prefix: prefix,
    };

    try {
      const listResponse = await this.s3.listObjectsV2(listParams); // listObjectsV2 메서드 사용
      if (listResponse.Contents) {
        const objectsToDelete = listResponse.Contents.map((object) => ({
          Key: object.Key,
        }));

        const deleteParams = {
          Bucket: this.S3_BUCKET,
          Delete: { Objects: objectsToDelete },
        };

        await this.s3.send(new DeleteObjectsCommand(deleteParams));
        return true; // 이미지 삭제 성공
      } else {
        return false; // 삭제할 이미지 없음
      }
    } catch (error) {
      console.error('S3 이미지 삭제 오류:', error);
      return false; // 이미지 삭제 실패
    }
  }
}
