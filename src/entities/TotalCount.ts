import { User } from '@src/entities/User';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('UQ_total_count_user_id', ['userId'], { unique: true })
@Entity('total_count')
export class TotalCount {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '토탈 카운트 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    unique: true,
    comment: '유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'mentor_board_count',
    comment: '멘토 게시글 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  mentorBoardCount: number;

  @Column('int', {
    name: 'help_you_comment_count',
    comment: '도와줄게요 댓글 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  helpYouCommentCount: number;

  @Column('int', {
    name: 'mentor_board_like_count',
    comment: '멘토 게시글 좋아요 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  mentorBoardLikeCount: number;

  @Column('int', {
    name: 'badge_count',
    comment: '뱃지 획득 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  badgeCount: number;

  @Column('int', {
    name: 'review_count',
    comment: '리뷰 받은 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  reviewCount: number;

  @Column('int', {
    name: 'mentor_board_count_in_seven_days',
    comment: '1주일 내에 멘토 게시글 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  mentorBoardCountInSevenDays: number;

  @Column('int', {
    name: 'help_you_comment_count_in_seven_days',
    comment: '1주일 내에 도와줄게요 댓글 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  helpYouCommentCountInSevenDays: number;

  @Column('int', {
    name: 'mentor_board_like_count_in_seven_days',
    comment: '1주일 내에 멘토 게시글 좋아요 받은 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  mentorBoardLikeCountInSevenDays: number;

  @Column('int', {
    name: 'badge_count_in_seven_days',
    comment: '1주일 내에 뱃지 획득 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  badgeCountInSevenDays: number;

  @Column('int', {
    name: 'review_count_in_seven_days',
    comment: '1주일 내에 리뷰 받은 카운트',
    unsigned: true,
    default: () => "'0'",
  })
  reviewCountInSevenDays: number;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @OneToOne(() => User, (user) => user.totalCount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
