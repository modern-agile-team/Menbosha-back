import { UserBadge } from "src/users/entities/user-badge.entity";
import { EntitySubscriberInterface, EventSubscriber } from "typeorm";

@EventSubscriber()
export class UserBadgeSubscriber implements EntitySubscriberInterface<UserBadge> {
  listenTo() {
    return UserBadge;
  }
}