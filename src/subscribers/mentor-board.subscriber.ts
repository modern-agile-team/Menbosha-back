import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class MentorBoardSubscriber
  implements EntitySubscriberInterface<MentorBoard>
{
  listenTo() {
    return MentorBoard;
  }

  async afterInsert(event: InsertEvent<MentorBoard>): Promise<void> {
    const { userId } = event.entity;

    await event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        mentorBoardCount: () => 'mentorBoardCount + 1',
        mentorBoardCountInSevenDays: () => 'mentorBoardCountInSevenDays + 1',
      })
      .where({ userId })
      .execute();
  }

  async afterRemove(event: RemoveEvent<MentorBoard>): Promise<void> {
    const { userId } = event.entity;

    await event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        mentorBoardCount: () => 'mentorBoardCount - 1',
        mentorBoardCountInSevenDays: () => 'mentorBoardCountInSevenDays - 1',
      })
      .where({ userId })
      .execute();
  }
}
