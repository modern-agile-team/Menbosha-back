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

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'mentor_id' })
  mentorId: number;

  @Column({ name: 'mentee' })
  menteeId: number;

  @OneToOne(() => User, (userId: User) => userId.mentor, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mentor_id' })
  mentor: User;

  @OneToOne(() => User, (userId: User) => userId.mentee, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mentee_id' })
  mentee: User;

  @Column({ name: 'review' })
  review: string;

  @OneToOne(() => User, (userId: User) => userId.userImage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
