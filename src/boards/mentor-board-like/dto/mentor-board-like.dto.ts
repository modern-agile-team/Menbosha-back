import { MentorBoardLike } from '../entities/mentor-board-like.entity';

export class MentorBoardLikeDto
  implements Omit<MentorBoardLike, 'mentorBoard' | 'user'>
{
  id: number;
  mentorBoardId: number;
  userId: number;
  createdAt: Date;
}
