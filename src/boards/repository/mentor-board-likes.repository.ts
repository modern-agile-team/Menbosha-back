import { LikesService } from 'src/like/services/likes.service';
import { DataSource, EntityManager } from 'typeorm';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { MentorBoardHotPostsService } from '../services/mentor-board-hot-posts.service';

export class MentorBoardLikesRepository {
  constructor(
    private readonly dataSource: DataSource,
    private readonly likesService: LikesService<MentorBoardLike>,
    private readonly mentorBoardHotPostService: MentorBoardHotPostsService,
  ) {}

  async createMentorBoardLike(
    entityManager: EntityManager,
    mentorBoardId: number,
    userId: number,
  ) {
    return this.likesService.createLikeWithEntityManager(
      entityManager,
      mentorBoardId,
      userId,
    );
  }
}
