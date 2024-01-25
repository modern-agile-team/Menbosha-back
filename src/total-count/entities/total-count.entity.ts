import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'total_count' })
export class TotalCount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'mentor_board_count', default: 0 })
  mentorBoardCount: number;

  @Column({ name: 'help_you_comment_count', default: 0 })
  helpYouCommentCount: number;

  @Column({ name: 'mentor_board_like_count', default: 0 })
  mentorBoardLikeCount: number;

  @Column({ name: 'badge_count', default: 0 })
  badgeCount: number;

  @Column({ name: 'review_count', default: 0 })
  reviewCount: number;

  @Column({ name: 'mentor_board_count_in_seven_days', default: 0 })
  mentorBoardCountInSevenDays: number;

  @Column({ name: 'help_you_comment_count_in_seven_days', default: 0 })
  helpYouCommentCountInSevenDays: number;

  @Column({ name: 'mentor_board_like_count_in_seven_days', default: 0 })
  mentorBoardLikeCountInSevenDays: number;

  @Column({ name: 'badge_count_in_seven_days', default: 0 })
  badgeCountInSevenDays: number;

  @Column({ name: 'review_count_in_seven_days', default: 0 })
  reviewCountInSevenDays: number;

  @OneToOne(() => User, (userId: User) => userId.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
