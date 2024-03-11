import { BannedUser } from '@src/entities/BannedUser';
import { User } from '@src/entities/User';
import { UserStatus } from '@src/users/constants/user-status.enum';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class BannedUserSubscriber
  implements EntitySubscriberInterface<BannedUser>
{
  listenTo() {
    return BannedUser;
  }

  async afterInsert(event: InsertEvent<BannedUser>): Promise<void> {
    const bannedUser = event.entity;

    await event.manager
      .getRepository(User)
      .update({ id: bannedUser.bannedUserId }, { status: UserStatus.INACTIVE });
  }
}
