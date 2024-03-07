import { MentorBoardLike } from '@src/boards/entities/mentor-board-like.entity';
import { TotalCount } from '@src/total-count/entities/total-count.entity';
import { MentorBoard } from '@src/boards/entities/mentor-board.entity';
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

    if (
      existBoard.mentorBoardLikes.length + 1 === 10 &&
      !existBoard.popularAt
    ) {
      await event.manager
        .getRepository(MentorBoard)
        .update({ id: existBoard.id }, { popularAt: new Date() });
    }

    await event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        mentorBoardLikeCount: () => 'mentorBoardLikeCount + 1',
        mentorBoardLikeCountInSevenDays: () =>
          'mentorBoardLikeCountInSevenDays + 1',
      })
      .where({ userId: existBoard.userId })
      .execute();
  }

  async afterRemove(event: RemoveEvent<MentorBoardLike>): Promise<void> {
    const { existBoard } = event.queryRunner.data;

    if (existBoard.mentorBoardLikes.length - 1 === 9 && existBoard.popularAt) {
      await event.manager
        .getRepository(MentorBoard)
        .update({ id: existBoard.id }, { popularAt: null });
    }

    await event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        mentorBoardLikeCount: () => 'mentorBoardLikeCount - 1',
        mentorBoardLikeCountInSevenDays: () =>
          'mentorBoardLikeCountInSevenDays - 1',
      })
      .where({ userId: existBoard.userId })
      .execute();
  }
}
