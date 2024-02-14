import { MentorReview } from 'src/mentors/mentor-reviews/entities/mentor-review.entity';
import { MentorReviewChecklistCount } from 'src/total-count/entities/mentor-review-checklist-count.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LoadEvent,
  UpdateEvent,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@EventSubscriber()
export class MentorReviewChecklistCountSubscriber
  implements EntitySubscriberInterface<MentorReview>
{
  listenTo() {
    return MentorReview;
  }

  async afterInsert(event: InsertEvent<MentorReview>) {
    const incrementColumns = Object.keys(event.entity)
      .filter((key) => event.entity[key] === true)
      .reduce((result, key) => {
        result[`${key}Count`] = () => `${key}Count + 1`;
        return result;
      }, {}) as QueryDeepPartialEntity<MentorReviewChecklistCount>;

    await event.manager
      .getRepository(MentorReviewChecklistCount)
      .createQueryBuilder('mentorReviewChecklistCount')
      .update(incrementColumns)
      .where({ userId: event.entity.mentorId })
      .execute();
  }

  afterLoad(
    entity: MentorReview,
    event?: LoadEvent<MentorReview>,
  ): void | Promise<any> {
    console.log(entity);
  }

  async afterUpdate(event: UpdateEvent<MentorReview>): Promise<void> {
    console.log(event.entity);
  }
}
