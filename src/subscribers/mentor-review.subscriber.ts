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

  async afterInsert(event: InsertEvent<MentorReview>): Promise<void> {
    const { mentorId } = event.entity;

    await event.queryRunner.manager
      .createQueryBuilder()
      .update(TotalCount)
      .set({
        reviewCount: () => 'reviewCount + 1',
        reviewCountInSevenDays: () => 'reviewCountInSevenDays + 1',
      })
      .where({ userId: mentorId })
      .execute();
  }

  async afterUpdate(event: UpdateEvent<MentorReview>): Promise<void> {
    const { mentorId, deletedAt } = event.entity;

    if (deletedAt) {
      await event.queryRunner.manager
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
