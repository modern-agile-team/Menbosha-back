import { TotalCount } from 'src/total-count/entities/total-count.entity';
import { UserBadge } from 'src/users/entities/user-badge.entity';
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

  afterInsert(event: InsertEvent<UserBadge>): void | Promise<any> {
    const { userId } = event.entity;

    event.queryRunner.manager
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
