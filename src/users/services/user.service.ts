import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, FindManyOptions, FindOneOptions } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Provider } from '@src/auth/enums/provider.enum';
import { UserInfo } from '@src/auth/interfaces/user-info.interface';
import { UserBadgeRepository } from '@src/users/repositories/user-badge.repository';
import { UserIntroRepository } from '@src/users/repositories/user-intro.repository';
import { MyIntroDto } from '@src/users/dtos/get-my-intro.dto';
import { MyProfileResponseDTO } from '@src/users/dtos/get-my-profile.dto';
import { UserBadgeResponseDTO } from '@src/users/dtos/get-user-badge.dto';
import { UserImageRepository } from '@src/users/repositories/user-image.repository';
import { UserRepository } from '@src/users/repositories/user.repository';
import { User } from '@src/users/entities/user.entity';
import { TotalCountService } from '@src/total-count/services/total-count.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userImageRepository: UserImageRepository,
    private readonly userBadgeRepository: UserBadgeRepository,
    private readonly userIntroRepository: UserIntroRepository,
    private readonly totalCountService: TotalCountService,
  ) {}

  findAll(options: FindManyOptions<User>) {
    return this.userRepository.findAll(options);
  }

  findUser(uniqueId: string, provider: Provider) {
    return this.userRepository.findUser(uniqueId, provider);
  }

  async findOneByQueryBuilderOrNotFound(userId: number): Promise<User> {
    const existUser = await this.userRepository.findOneByQueryBuilder(userId);

    if (!existUser) {
      throw new NotFoundException('해당 유저를 찾지 못했습니다.');
    }

    return existUser;
  }

  findOneAndSelectAllByQueryBuilder(email: string, provider: Provider) {
    return this.userRepository.findOneAndSelectAllByQueryBuilder(
      email,
      provider,
    );
  }

  findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  async findOneByOrNotFound(options: FindOneOptions<User>) {
    const existUser = await this.findOne(options);

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
      await this.userRepository.getUser(userId),
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

  getUserInfo(userId: number) {
    return this.userRepository.getUserInfo(userId);
  }

  async getMyInfoWithOwner(userId: number, targetId: number) {
    const { name, email, role, provider } =
      await this.userRepository.getUser(userId);
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
