import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
  } from 'typeorm';
  import { MentorReviewChecklist } from '../../../mentors/mentor-reviews/mentor-review-checklist/entities/mentor-review-checklist.entity';
  import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
  import { MentorReviewChecklistCount } from '../mentor-review-checklist-count.entity';
  
  @EventSubscriber()
  export class MentorReviewChecklistCountSubscriber
    implements EntitySubscriberInterface<MentorReviewChecklist>
  {
    listenTo() {
      return MentorReviewChecklist;
    }
  
    async afterInsert(event: InsertEvent<MentorReviewChecklist>) {
      const incrementColumns = Object.keys(event.entity)
        .filter((key) => event.entity[key] === true)
        .reduce((result, key) => {
          result[`${key}Count`] = () => `${key}Count + :incrementValue`;
          return result;
        }, {}) as QueryDeepPartialEntity<MentorReviewChecklistCount>;
  
        console.log(event);
  
      event.manager
        .getRepository(MentorReviewChecklistCount)
        .update({userId: event.manager.},{ incrementColumns });
    }
  }
  