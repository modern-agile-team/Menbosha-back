import { MentorBoardLike } from 'src/boards/entities/mentor-board-like.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class MentorBoardLikeSubscriber
  implements EntitySubscriberInterface<MentorBoardLike>
{
  listenTo() {
    return MentorBoardLike;
  }

  async afterInsert(event: InsertEvent<MentorBoardLike>): Promise<void> {
    const { existBoard } = event.queryRunner.data;
    const { parentId } = event.entity;
    const { userId } = await event.connection
      .createQueryBuilder()
      .select('mentorBoard.userId', 'userId')
      .from('mentor_board', 'mentorBoard')
      .where('mentorBoard.id = :parentId', { parentId })
      .getRawOne();

    if (
      existBoard.mentorBoardLikes.length + 1 === 10 &&
      !existBoard.popularAt
    ) {
      await event.manager
        .getRepository(MentorBoard)
        .update({ id: existBoard.id }, { popularAt: new Date() });
    }

    event.connection.manager.increment(
      TotalCount,
      { userId },
      'mentorBoardLikeCount',
      1,
    );
    event.connection.manager.increment(
      TotalCount,
      { userId },
      'mentorBoardLikeCountInSevenDays',
      1,
    );
  }

  async afterRemove(event: RemoveEvent<MentorBoardLike>): Promise<void> {
    const { existBoard } = event.queryRunner.data;

    if (existBoard.mentorBoardLikes.length - 1 === 9 && existBoard.popularAt) {
      await event.manager
        .getRepository(MentorBoard)
        .update({ id: existBoard.id }, { popularAt: null });
    }

    event.connection.manager.decrement(
      TotalCount,
      { userId: existBoard.userId },
      'mentorBoardLikeCount',
      1,
    );
    event.connection.manager.decrement(
      TotalCount,
      { userId: existBoard.userId },
      'mentorBoardLikeCountInSevenDays',
      1,
    );
  }
}
