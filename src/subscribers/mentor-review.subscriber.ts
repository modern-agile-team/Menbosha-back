import { MentorReview } from 'src/mentors/mentor-reviews/entities/mentor-review.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
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
}
