import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Service } from '@src/common/s3/services/s3.service';
import { ENV_KEY } from '@src/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/core/app-config/services/app-config.service';
import { UserImage } from '@src/entities/UserImage';
import { UserImageRepository } from '@src/users/repositories/user-image.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserImageService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly userImageRepository: UserImageRepository,
    private readonly appConfigService: AppConfigService,
  ) {}

  findUserImage(userId: number): Promise<UserImage> {
    return this.userImageRepository.findUserImage(userId);
  }

  updateUserImageByUrl(userId: number, profileImage: string) {
    return this.userImageRepository.updateUserImageByUrl(userId, profileImage);
  }

  uploadUserImageWithEntityManager(
    entityManager: EntityManager,
    userId: number,
    imageUrl: string,
  ) {
    return this.userImageRepository.uploadUserImageWithEntityManager(
      entityManager,
      userId,
      imageUrl,
    );
  }

  async updateImageWithFile(
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
      const userImage = (await this.userImageRepository.findUserImage(userId))
        .imageUrl; // DB에 이미지가 있는지 확인
      const imageUrlParts = userImage.split('/');
      const imageKey = imageUrlParts[imageUrlParts.length - 1]; // S3에 업로드된 이미지의 키
      const dbImageUrl = imageUrlParts[imageUrlParts.length - 3]; // 이미지 제공자 이름

      if (
        dbImageUrl === this.appConfigService.get<string>(ENV_KEY.AWS_S3_URL) &&
        imageKey !== 'default_user_image.png'
      ) {
        // S3에 업로드된 이미지이고, 기본 이미지가 아닌 경우
        await this.s3Service.deleteImage('UserImages/' + imageKey); // S3에 업로드된 기존 이미지 삭제
      }

      const updateUserImage =
        await this.userImageRepository.updateUserImageByUrl(userId, imageUrl); // DB에 이미지 URL 업데이트
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
