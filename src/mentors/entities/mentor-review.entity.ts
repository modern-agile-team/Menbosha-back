import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { MentorReviewChecklist } from './mentor-review-checklist.entity';

@Entity({ name: 'mentor_review' })
export class MentorReview {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column({ name: 'mentor_id' })
  mentorId: number;

  @Column({ name: 'mentee_id' })
  menteeId: number;

  @ManyToOne(() => User, (user) => user.mentor, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'mentor_id' })
  mentor: User;

  @ManyToOne(() => User, (user) => user.mentee, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'mentee_id' })
  mentee: User;

  @OneToOne(
    () => MentorReviewChecklist,
    (mentorReviewChecklist) => mentorReviewChecklist.mentorReview,
  )
  mentorReviewChecklist: MentorReviewChecklist;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('varchar', { name: 'review', length: 255, nullable: true })
  review: string | null;
}
