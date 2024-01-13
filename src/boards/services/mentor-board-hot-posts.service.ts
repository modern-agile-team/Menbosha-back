import { Injectable } from '@nestjs/common';
import { HotPostsRepository } from 'src/hot-posts/repositories/hot-posts.repository';
import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class MentorBoardHotPostsService {
  constructor(
    private readonly hotPostsRepository: HotPostsRepository<MentorBoardHotPost>,
  ) {}

  createMentorBoardHotPostOrIncrease(
    entityManager: EntityManager,
    mentorBoardId: number,
    likeCount: number,
  ): Promise<void> {
    if (likeCount === 10) {
      return this.hotPostsRepository.createHotPost(
        entityManager,
        mentorBoardId,
        likeCount,
      );
    } else if (likeCount > 10) {
      return this.hotPostsRepository.increaseLikeCount(
        entityManager,
        mentorBoardId,
      );
    }

    return;
  }

  findAllMentorBoardHotPostsWithLimit() {
    return this.hotPostsRepository.findAllHotPosts({
      select: {
        id: true,
        likeCount: true,
        mentorBoard: {
          id: true,
          userId: true,
          head: true,
          body: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
          user: {
            name: true,
            userImage: {
              imageUrl: true,
            },
          },
          mentorBoardImages: {
            id: true,
            imageUrl: true,
          },
        },
        createdAt: true,
      },
      relations: {
        mentorBoard: {
          user: {
            userImage: true,
          },
          mentorBoardImages: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: 5,
    });
  }

  deleteMentorBoardHotPostOrDecrease(
    entityManager: EntityManager,
    mentorBoardId: number,
    likeCount: number,
  ): Promise<void> {
    if (likeCount < 10) {
      return this.hotPostsRepository.deleteHotPost(
        entityManager,
        mentorBoardId,
      );
    } else if (likeCount > 9) {
      return this.hotPostsRepository.decreaseLikeCount(
        entityManager,
        mentorBoardId,
      );
    }

    return;
  }
}
