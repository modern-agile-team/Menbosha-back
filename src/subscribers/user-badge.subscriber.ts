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
    event.connection.manager.increment(TotalCount, { userId }, 'badgeCount', 1);
    event.connection.manager.increment(
      TotalCount,
      { userId },
      'badgeCountInSevenDays',
      1,
    );
  }
}
