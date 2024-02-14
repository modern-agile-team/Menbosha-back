import { MentorReview } from 'src/mentors/mentor-reviews/entities/mentor-review.entity';
import { MentorReviewChecklistCount } from 'src/total-count/entities/mentor-review-checklist-count.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
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
        result[`${key}Count`] = () => `${key}Count + :incrementValue`;
        return result;
      }, {}) as QueryDeepPartialEntity<MentorReviewChecklistCount>;

    console.log(event);

    //   event.manager
    //     .getRepository(MentorReviewChecklistCount)
    //     .update({userId: event.manager.},{ incrementColumns });
  }
}
