import { Injectable } from '@nestjs/common';
import { HotPostsService } from 'src/hot-posts/services/hot-posts.service';
import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class MentorBoardHotPostsService {
  constructor(
    private readonly hotPostsService: HotPostsService<MentorBoardHotPost>,
  ) {}
  createMentorBoardHotPostOrIncrease(
    entityManager: EntityManager,
    mentorBoardId: number,
    likeCount: number,
  ): Promise<void> {
    if (likeCount === 10) {
      return this.hotPostsService.createHotPost(
        entityManager,
        mentorBoardId,
        likeCount,
      );
    } else if (likeCount > 10) {
      return this.hotPostsService.increaseLikeCount(
        entityManager,
        mentorBoardId,
      );
    }

    return;
  }

  findAllMentorBoardHotPostsWithLimit() {
    return this.hotPostsService.findAllHotPosts({
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
      return this.hotPostsService.deleteHotPost(entityManager, mentorBoardId);
    } else if (likeCount > 9) {
      return this.hotPostsService.decreaseLikeCount(
        entityManager,
        mentorBoardId,
      );
    }

    return;
  }
}
