import { TotalCount } from '@src/entities/TotalCount';
import { UserBadge } from '@src/entities/UserBadge';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class UserBadgeSubscriber
  implements EntitySubscriberInterface<UserBadge>
{
  listenTo() {
    return UserBadge;
  }

  async afterInsert(event: InsertEvent<UserBadge>): Promise<void> {
    const { userId } = event.entity;

    await event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        badgeCount: () => 'badgeCount + 1',
        badgeCountInSevenDays: () => 'badgeCountInSevenDays + 1',
      })
      .where({ userId })
      .execute();
  }
}
