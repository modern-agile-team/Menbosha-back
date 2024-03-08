import { HelpYouComment } from '@src/entities/HelpYouComment';
import { TotalCount } from '@src/entities/TotalCount';
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

  async afterInsert(event: InsertEvent<HelpYouComment>): Promise<void> {
    const { userId } = event.entity;

    await event.queryRunner.manager
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

  async afterRemove(event: RemoveEvent<HelpYouComment>): Promise<void> {
    const { userId } = event.entity;

    await event.queryRunner.manager
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
