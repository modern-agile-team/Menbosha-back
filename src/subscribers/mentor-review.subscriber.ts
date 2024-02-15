import { MentorReview } from 'src/mentors/mentor-reviews/entities/mentor-review.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class MentorReviewSubscriber
  implements EntitySubscriberInterface<MentorReview>
{
  listenTo() {
    return MentorReview;
  }

  afterInsert(event: InsertEvent<MentorReview>): void | Promise<any> {
    const { mentorId } = event.entity;

    event.connection.manager.increment(
      TotalCount,
      { userId: mentorId },
      'reviewCount',
      1,
    );
    event.connection.manager.increment(
      TotalCount,
      { userId: mentorId },
      'reviewCountInSevenDays',
      1,
    );
  }

  afterUpdate(event: UpdateEvent<MentorReview>): void | Promise<any> {
    const { mentorId, deletedAt } = event.entity;
    console.log(mentorId, deletedAt);
    if (deletedAt) {
      event.connection.manager.decrement(
        TotalCount,
        { userId: mentorId },
        'reviewCount',
        1,
      );
      event.connection.manager.decrement(
        TotalCount,
        { userId: mentorId },
        'reviewCountInSevenDays',
        1,
      );
    }
  }
}
