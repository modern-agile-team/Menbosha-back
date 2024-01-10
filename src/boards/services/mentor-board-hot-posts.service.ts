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
    if (likeCount === 5) {
      return this.hotPostsService.createHotPost(
        entityManager,
        mentorBoardId,
        likeCount,
      );
    } else if (likeCount > 5) {
      return this.hotPostsService.increaseLikeCount(
        entityManager,
        mentorBoardId,
      );
    }

    return;
  }

  findAllMentorBoardHotPosts() {
    return this.hotPostsService.findAllHotPosts({
      select: {
        id: true,
        mentorBoard: {
          id: true,
          userId: true,
          user: {
            name: true,
            userImage: {
              imageUrl: true,
            },
          },
          mentorBoardImages: {
            imageUrl: true,
          },
        },
      },
      relations: {
        mentorBoard: {
          user: {
            userImage: true,
          },
          mentorBoardImages: true,
        },
      },
    });
  }

  deleteMentorBoardHotPostOrDecrease(
    entityManager: EntityManager,
    mentorBoardId: number,
    likeCount: number,
  ): Promise<void> {
    if (likeCount === 4) {
      return this.hotPostsService.deleteHotPost(entityManager, mentorBoardId);
    } else if (likeCount > 4) {
      return this.hotPostsService.decreaseLikeCount(
        entityManager,
        mentorBoardId,
      );
    }

    return;
  }
}
