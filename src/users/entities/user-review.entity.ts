import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_review' })
export class UserReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mentor_id' })
  mentorId: number;

  @Column({ name: 'mentee_id' })
  menteeId: number;

  @OneToOne(() => User, (user) => user.mentor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mentor_id' })
  mentor: User;

  @OneToOne(() => User, (user) => user.mentee, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mentee_id' })
  mentee: User;

  @Column({ name: 'review' })
  review: string;
}
