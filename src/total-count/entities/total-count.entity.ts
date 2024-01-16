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

  @Column({ name: 'count_mentor_board', default: 0 })
  countMentorBoard: number;

  @Column({ name: 'count_help_you_comment', default: 0 })
  countHelpYouComment: number;

  @Column({ name: 'count_mentor_board_like', default: 0 })
  countMentorBoardLike: number;

  @Column({ name: 'count_badge', default: 0 })
  countBadge: number;

  @Column({ name: 'count_review', default: 0 })
  countReview: number;

  @Column({ name: 'count_mentor_board_7days', default: 0 })
  countMentorBoard7days: number;

  @Column({ name: 'count_help_you_comment_7days', default: 0 })
  countHelpYouComment7days: number;

  @Column({ name: 'count_mentor_board_like_7days', default: 0 })
  countMentorBoardLike7days: number;

  @Column({ name: 'count_badge_7days', default: 0 })
  countBadge7days: number;

  @Column({ name: 'count_review_7days', default: 0 })
  countReview7days: number;

  @OneToOne(() => User, (userId: User) => userId.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
