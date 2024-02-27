import { BannedUser } from '@src/admins/banned-user/entities/banned-user.entity';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { User } from '@src/users/entities/user.entity';
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
