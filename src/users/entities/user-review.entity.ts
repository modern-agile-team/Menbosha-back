import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { ReviewChecklist } from './review-check-list.entity';

@Entity({ name: 'user_review' })
export class UserReview {
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
    () => ReviewChecklist,
    (reviewChecklist) => reviewChecklist.userReview,
  )
  reviewChecklists: ReviewChecklist[];

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('varchar', { name: 'review', length: 255 })
  review: string;
}
