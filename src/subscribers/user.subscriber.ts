import { User } from '@src/entities/User';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  SoftRemoveEvent,
} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }
}
