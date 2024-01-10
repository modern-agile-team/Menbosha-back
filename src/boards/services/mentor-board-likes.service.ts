import { Injectable } from '@nestjs/common';
import { MentorBoardLike } from '../entities/mentor-board-like.entity';
import { MentorBoardService } from 'src/boards/services/mentor.board.service';
import { LikesService } from 'src/like/services/likes.service';
import { HotPostsService } from 'src/hot-posts/services/hot-posts.service';
import { MentorBoardHotPost } from '../entities/mentor-board-hot-post.entity';
import { DataSource } from 'typeorm';
import { MentorBoardJoinLikesDto } from '../dto/mentorBoard/mentor-board-join-likes.dto';

@Injectable()
export class MentorBoardLikeService {
  constructor(
    private readonly likesService: LikesService<MentorBoardLike>,
    private readonly dataSource: DataSource,
    private readonly hotPostsService: HotPostsService<MentorBoardHotPost>,
    private readonly mentorBoardService: MentorBoardService,
  ) {}
  async createMentorBoardLikeAndHotPost(
    boardId: number,
    userId: number,
  ): Promise<{ isLike: boolean }> {
    const existBoard = await this.mentorBoardService.findOneByOrNotFound({
      select: {
        id: true,
        mentorBoardLikes: {
          id: true,
        },
      },
      where: { id: boardId },
      relations: ['mentorBoardLikes'],
    });

    const mentorBoardLike = await this.likesService.createLike(
      existBoard.id,
      userId,
    );

    existBoard.mentorBoardLikes.push(mentorBoardLike);

    const likeCount = existBoard.mentorBoardLikes.length;

    if (likeCount === 5) {
      await this.hotPostsService.createHotPost(existBoard.id, likeCount);
    } else if (likeCount > 5) {
      await this.hotPostsService.increaseLikeCount(existBoard.id);
    }

    return { isLike: true };
  }

  async getMentorBoardLikes(
    boardId: number,
    userId: number,
  ): Promise<{ isLike: boolean; boardLikesCount: number }> {
    await this.mentorBoardService.findOneByOrNotFound({
      where: { id: boardId },
    });

    const mentorBoardLikes = await this.likesService.getLike({
      where: { parentId: boardId },
    });

    return mentorBoardLikes.find(
      (mentorBoardLike) => mentorBoardLike.userId === userId,
    )
      ? { isLike: true, boardLikesCount: mentorBoardLikes.length }
      : { isLike: false, boardLikesCount: mentorBoardLikes.length };
  }

  async deleteMentorBoardLike(
    boardId: number,
    userId: number,
  ): Promise<{ isLike: boolean }> {
    const existBoard: MentorBoardJoinLikesDto =
      await this.mentorBoardService.findOneByOrNotFound({
        where: { id: boardId },
        relations: ['mentorBoardLikes'],
      });

    await this.likesService.deleteLike(existBoard.id, userId);

    if (existBoard.mentorBoardLikes.length === 4) {
    }

    return { isLike: false };
  }
}
