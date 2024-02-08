import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_ranking' })
export class UserRanking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  @Column({ name: 'activity_category_list_id', nullable: true })
  activityCategoryId: number | null;

  @Column({ name: 'name', nullable: true })
  name: string | null;

  @Column({ name: 'short_intro', nullable: true })
  shortIntro: string | null;

  @Column({ name: 'career', nullable: true })
  career: string | null;

  @Column({ name: 'custom_category', nullable: true })
  customCategory: string | null;

  @Column({ name: 'rank', nullable: true })
  rank: number | null;

  @Column({ name: 'review_count', nullable: true })
  reviewCount: number | null;

  @ManyToOne(() => User, (userId: User) => userId.userRanking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
