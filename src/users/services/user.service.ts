import { UserIntroRepository } from './../repositories/user-intro.repository';
import { UserBadgeRepository } from './../repositories/user-badge.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserImageRepository } from '../repositories/user-image.repository';
import { EntityManager, FindManyOptions, FindOneOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserBadgeResponseDTO } from '../dtos/get-user-badge.dto';
import { plainToInstance } from 'class-transformer';
import { MyProfileResponseDTO } from '../dtos/get-my-profile.dto';
import { MyIntroDto } from '../dtos/get-my-intro.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Provider } from '@src/auth/enums/provider.enum';
import { UserInfo } from '@src/auth/interfaces/user-info.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userImageRepository: UserImageRepository,
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly userIntroRepository: UserIntroRepository,
  ) {}

  findAll(options: FindManyOptions<User>) {
    return this.userRepository.findAll(options);
  }

  findUser(email: string, provider: Provider) {
    return this.userRepository.findUser(email, provider);
  }

  async findOneByOrNotFound(options: FindOneOptions<User>) {
    const existUser = await this.userRepository.findOne(options);

    if (!existUser) {
      throw new NotFoundException('해당 유저를 찾지 못했습니다.');
    }

    return existUser;
  }

  createUser(entityManager: EntityManager, userInfo: UserInfo) {
    return this.userRepository.createUser(entityManager, userInfo);
  }

  async getMyProfile(userId: number) {
    const userInfo = plainToInstance(
      MyProfileResponseDTO,
      await this.userRepository.getUserInfo(userId),
    );
    const intro = plainToInstance(
      MyIntroDto,
      await this.userIntroRepository.getUserIntro(userId),
    )[0];

    const image = (await this.userImageRepository.findUserImage(userId))
      .imageUrl;

    return { ...userInfo, image, intro };
  }

  async getMyRank(userId: number) {
    const rank = await this.userRepository.getUserRank(userId);
    const badge = plainToInstance(
      UserBadgeResponseDTO,
      await this.userBadgeRepository.getUserBadge(userId),
    );

    return { rank, badge };
  }

  async getUserInfo(userId: number) {
    const userInfo = plainToInstance(
      MyProfileResponseDTO,
      await this.userRepository.getUserInfo(userId),
    );
    const image = (await this.userImageRepository.findUserImage(userId))
      .imageUrl;
    const intro = plainToInstance(
      MyIntroDto,
      await this.userIntroRepository.getUserIntro(userId),
    )[0];
    const badge = plainToInstance(
      UserBadgeResponseDTO,
      await this.userBadgeRepository.getUserBadge(userId),
    );

    return { ...userInfo, image, intro, badge };
  }

  async getMyInfoWithOwner(userId: number, targetId: number) {
    const { name, email, role, provider } =
      await this.userRepository.getUserInfo(userId);
    const userImage = (await this.userImageRepository.findUserImage(userId))
      .imageUrl;
    return {
      userId,
      name,
      email,
      role,
      provider,
      userImage,
      owner: userId === targetId,
    };
  }

  updateUser(userId: number, partialEntity: QueryDeepPartialEntity<User>) {
    return this.userRepository.updateUser(userId, partialEntity);
  }

  async countPageMentors(categoryId: number) {
    const limit = 10;
    const total = categoryId
      ? await this.userRepository.countMentorsInCategory(categoryId)
      : await this.userRepository.countMentors();
    const page = total / limit;
    const totalPage = Math.ceil(page);
    return { total, totalPage };
  }
}
