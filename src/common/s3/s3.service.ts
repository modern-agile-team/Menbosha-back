import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  S3,
} from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class S3Service {
  private s3 = new S3({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_S3_REGION,
  });

  private readonly S3_ADDRESS = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/`;

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
          Bucket: process.env.AWS_S3_BUCKET,
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
      Bucket: process.env.AWS_S3_BUCKET,
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
      Bucket: process.env.AWS_S3_BUCKET,
      Prefix: prefix,
    };

    try {
      const listResponse = await this.s3.listObjectsV2(listParams); // listObjectsV2 메서드 사용
      if (listResponse.Contents) {
        const objectsToDelete = listResponse.Contents.map((object) => ({
          Key: object.Key,
        }));

        const deleteParams = {
          Bucket: process.env.AWS_S3_BUCKET,
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
