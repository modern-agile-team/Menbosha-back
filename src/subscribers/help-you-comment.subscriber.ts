import { HelpYouComment } from 'src/comments/entities/help-you-comment.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
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
      'total_count',
      { userId },
      'helpYouCommentCount',
      1,
    );
    event.connection.manager.increment(
      'total_count',
      { userId },
      'helpYouCommentCountInSevenDays',
      1,
    );
  }
}
