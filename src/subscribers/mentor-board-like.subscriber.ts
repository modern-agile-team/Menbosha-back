import { MentorBoardLike } from 'src/boards/entities/mentor-board-like.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
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

  async afterInsert(event: InsertEvent<MentorBoardLike>): Promise<any> {
    const { parentId } = event.entity;
    const { userId } = await event.connection
      .createQueryBuilder()
      .select('mentorBoard.userId', 'userId')
      .from('mentor_board', 'mentorBoard')
      .where('mentorBoard.id = :parentId', { parentId })
      .getRawOne();

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

  // afterQuery(event: AfterQueryEvent<MentorBoardLike>): void | Promise<any> {
  //   console.log('afterQuery', event);
  // }

  async beforeRemove(event: RemoveEvent<MentorBoardLike>): Promise<any> {
    // console.log('beforeRemove', event); // FIXME : 이거 undefined 나와서 아래 로직 실행 안됨
    // const { parentId } = event.entity;
    // const { userId } = await event.connection
    //   .createQueryBuilder()
    //   .select('mentorBoard.userId', 'userId')
    //   .from('mentor_board', 'mentorBoard')
    //   .where('mentorBoard.id = :parentId', { parentId })
    //   .getRawOne();
    // event.connection.manager.decrement(
    //   TotalCount,
    //   { userId },
    //   'mentorBoardLikeCount',
    //   1,
    // );
    // event.connection.manager.decrement(
    //   TotalCount,
    //   { userId },
    //   'mentorBoardLikeCountInSevenDays',
    //   1,
    // );
  }
}
