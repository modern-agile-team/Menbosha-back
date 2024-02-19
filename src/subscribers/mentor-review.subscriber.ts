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

    event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        reviewCount: () => 'reviewCount + 1',
        reviewCountInSevenDays: () => 'reviewCountInSevenDays + 1',
      })
      .where({ userId: mentorId })
      .execute();
  }

  afterUpdate(event: UpdateEvent<MentorReview>): void | Promise<any> {
    const { mentorId, deletedAt } = event.entity;

    if (deletedAt) {
      event.queryRunner.manager
        .createQueryBuilder()
        .update(TotalCount)
        .set({
          reviewCount: () => 'reviewCount - 1',
          reviewCountInSevenDays: () => 'reviewCountInSevenDays - 1',
        })
        .where({ userId: mentorId })
        .execute();
    }
  }
}
