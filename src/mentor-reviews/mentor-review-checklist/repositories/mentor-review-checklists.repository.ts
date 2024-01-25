import { CustomRepository } from 'src/config/type-orm/decorators/custom-repository.decorator';
import { MentorReviewChecklist } from '../entities/mentor-review-checklist.entity';
import { Repository } from 'typeorm';

@CustomRepository(MentorReviewChecklist)
export class MentorReviewChecklistRepository extends Repository<MentorReviewChecklist> {}
