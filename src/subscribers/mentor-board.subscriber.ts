import { Injectable } from '@nestjs/common';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
@Injectable()
export class MentorBoardSubscriber
  implements EntitySubscriberInterface<MentorBoard>
{
  listenTo() {
    return MentorBoard;
  }

  afterInsert(event: InsertEvent<MentorBoard>) {
    const { userId } = event.entity;
    event.connection.manager.increment(
      TotalCount,
      { userId },
      'mentorBoardCount',
      1,
    );
    event.connection.manager.increment(
      TotalCount,
      { userId },
      'mentorBoardCountInSevenDays',
      1,
    );
  }
}
