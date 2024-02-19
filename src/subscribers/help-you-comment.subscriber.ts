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

    event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        helpYouCommentCount: () => 'helpYouCommentCount + 1',
        helpYouCommentCountInSevenDays: () =>
          'helpYouCommentCountInSevenDays + 1',
      })
      .where({ userId })
      .execute();
  }

  afterRemove(event: RemoveEvent<HelpYouComment>): void | Promise<any> {
    const { userId } = event.entity;

    event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        helpYouCommentCount: () => 'helpYouCommentCount - 1',
        helpYouCommentCountInSevenDays: () =>
          'helpYouCommentCountInSevenDays - 1',
      })
      .where({ userId })
      .execute();
  }
}
