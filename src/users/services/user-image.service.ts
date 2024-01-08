import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/common/s3/s3.service';
import { UserImageRepository } from '../repositories/user-image.repository';
import { InternalServerErrorException } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class UserImageService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly userImageRepository: UserImageRepository,
  ) {}

  async updateImage(
    userId: number,
    file: Express.Multer.File,
  ): Promise<{ message: string }> {
    try {
      const res = await this.s3Service.uploadImage(file, userId, 'UserImages'); // S3에 이미지 업로드
      if (!res) {
        throw new InternalServerErrorException(
          'S3 이미지 업로드에 실패했습니다.',
        );
      }

      const imageUrl = res.url; // S3에 업로드된 이미지 URL
      const checkUserImage = (
        await this.userImageRepository.checkUserImage(userId)
      ).imageUrl; // DB에 이미지가 있는지 확인
      const imageUrlParts = checkUserImage.split('/');
      const imageKey = imageUrlParts[imageUrlParts.length - 1]; // S3에 업로드된 이미지의 키
      const dbImageUrl = imageUrlParts[imageUrlParts.length - 3]; // 이미지 제공자 이름

      if (
        dbImageUrl === process.env.AWS_S3_URL &&
        imageKey !== 'UserIcon.svg'
      ) {
        // S3에 업로드된 이미지이고, 기본 이미지가 아닌 경우
        await this.s3Service.deleteImage('UserImages/' + imageKey); // S3에 업로드된 기존 이미지 삭제
      }

      const updateUserImage = await this.userImageRepository.updateUserImage(
        userId,
        imageUrl,
      ); // DB에 이미지 URL 업데이트
      if (!updateUserImage) {
        throw new InternalServerErrorException(
          '사용자 이미지 업데이트에 실패했습니다.',
        );
      } else {
        return { message: '이미지 업데이트에 성공했습니다.' };
      }
    } catch (error) {
      throw new InternalServerErrorException(
        '이미지 업로드 및 처리 중 오류가 발생했습니다.',
      );
    }
  }
}
