import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserImageRepository } from '../repositories/user-image.repository';
import { FindManyOptions } from 'typeorm';
import { User } from '../entities/user.entity';
import { PageByMentorListResponseDTO } from '../dtos/page-by-mentor-list-response-dto';

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

  async countPageMentors() {
    const limit = 10;
    const total = await this.userRepository.findIsMentors();
    const page = total / limit;
    const totalPage = Math.ceil(page);
    return { total, totalPage };
  }

  async getMentorList(
    page: number,
  ): Promise<{ data: PageByMentorListResponseDTO[] }> {
    const limit = 10;
    const skip = (page - 1) * limit;
    const take = limit;
    const mentors = await this.userRepository.findPageByMentors(skip, take);
    const mentorResponse: PageByMentorListResponseDTO[] = await Promise.all(
      mentors
        .filter((user) => user.isMentor === true) //filter로 user.isMentor = true인 경우만 불러오기
        .map(async (user) => {
          return {
            id: user.id,
            name: user.name,
            userImage: user.userImage ? user.userImage : [],
            userIntro: {
              introduce: user.userIntro.introduce.substring(0, 30),
              mainField: user.userIntro.mainField.substring(0, 30),
            },
          };
        }),
    );
    return { data: mentorResponse };
  }
}
