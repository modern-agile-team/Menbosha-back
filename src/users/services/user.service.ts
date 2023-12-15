import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserImageRepository } from '../repositories/user-image.repository';
import { FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userImageRepository: UserImageRepository,
  ) {}

  findAll(options: FindManyOptions<User>) {
    return this.userRepository.findAll(options);
  }

  async getMyInfo(userId: number) {
    if (!userId) {
      throw new HttpException(
        '토큰이 제공되지 않았습니다.',
        HttpStatus.LENGTH_REQUIRED,
      );
    }
    const { name, email, admin, provider } =
      await this.userRepository.getUserInfo(userId);
    const userImage = (await this.userImageRepository.checkUserImage(userId))
      .imageUrl;
    return {
      userId,
      name,
      email,
      admin,
      provider,
      userImage,
    };
  }

  async getMyInfoWithOwner(userId: number, targetId: number) {
    const { name, email, admin, provider } =
      await this.userRepository.getUserInfo(userId);
    const userImage = (await this.userImageRepository.checkUserImage(userId))
      .imageUrl;
    return {
      userId,
      name,
      email,
      admin,
      provider,
      userImage,
      owner: userId === targetId,
    };
  }
}
