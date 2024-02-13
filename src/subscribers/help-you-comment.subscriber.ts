import { HelpYouComment } from 'src/comments/entities/help-you-comment.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class HelpYouCommentSubscriber
  implements EntitySubscriberInterface<HelpYouComment>
{
  listenTo() {
    return HelpYouComment;
  }

  afterInsert(event: InsertEvent<HelpYouComment>): void | Promise<any> {
    const { userId } = event.entity;
    event.connection.manager.increment(
      TotalCount,
      { userId },
      'helpYouCommentCount',
      1,
    );
    event.connection.manager.increment(
      TotalCount,
      { userId },
      'helpYouCommentCountInSevenDays',
      1,
    );
  }

  afterRemove(event: RemoveEvent<HelpYouComment>): void | Promise<any> {
    const { userId } = event.entity;
    event.connection.manager.decrement(
      TotalCount,
      { userId },
      'helpYouCommentCount',
      1,
    );
    event.connection.manager.decrement(
      TotalCount,
      { userId },
      'helpYouCommentCountInSevenDays',
      1,
    );
  }
}
