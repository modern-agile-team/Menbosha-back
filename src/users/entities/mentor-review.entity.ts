import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { MentorReviewChecklist } from './mentor-review-checklist.entity';

@Entity({ name: 'mentor_review' })
export class MentorReview {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column({ name: 'mentor_id' })
  mentorId: number;

  @Column({ name: 'mentee_id' })
  menteeId: number;

  @OneToOne(() => User, (user) => user.mentor, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'mentor_id' })
  mentor: User;

  @OneToOne(() => User, (user) => user.mentee, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'mentee_id' })
  mentee: User;

  @OneToMany(
    () => MentorReviewChecklist,
    (mentorReviewChecklist) => mentorReviewChecklist.mentorReview,
  )
  mentorReviewChecklists: MentorReviewChecklist[];

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('varchar', { name: 'review', length: 255 })
  review: string;
}
