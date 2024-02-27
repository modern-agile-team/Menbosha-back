import { Injectable, NotFoundException } from '@nestjs/common';
import { UserImage } from '@src/users/entities/user-image.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UserImageRepository {
  constructor(private readonly entityManager: EntityManager) {}

  async findUserImage(userId: number): Promise<UserImage> {
    const userImage = await this.entityManager.findOne(UserImage, {
      where: { userId },
    });

    if (!userImage) {
      throw new NotFoundException('사용자 이미지를 찾을 수 없습니다.');
    }
    return userImage;
  }

  async uploadUserImageWithEntityManager(
    entityManager: EntityManager,
    userId: number,
    imageUrl: string,
  ): Promise<UserImage> {
    const userImage = new UserImage();
    userImage.userId = userId;
    userImage.imageUrl = imageUrl;

    return entityManager.save(userImage);
  }

  async updateUserImageByUrl(
    userId: number,
    newImageUrl: string,
  ): Promise<UserImage | null> {
    try {
      const userImage = await this.entityManager.findOne(UserImage, {
        where: { userId },
      });

      if (!userImage) {
        throw new NotFoundException('사용자 이미지를 찾을 수 없습니다.');
      }
      userImage.imageUrl = newImageUrl;
      await this.entityManager.save(userImage);

      return userImage;
    } catch (error) {
      console.error('이미지 업데이트 오류:', error);
      throw new NotFoundException('이미지 업데이트 오류');
    }
  }
}
