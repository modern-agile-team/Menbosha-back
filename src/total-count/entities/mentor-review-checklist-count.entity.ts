import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'mentor_review_checklist_count' })
export class MentorReviewChecklistCount {
  @PrimaryGeneratedColumn({
    unsigned: true,
    comment: '멘토 리뷰 체크리스트 고유 ID',
  })
  id: number;

  @Column({
    name: 'user_id',
    comment: '멘토 리뷰 체크리스트 카운트 유저 고유 ID',
  })
  userId: number;

  @Column('int', {
    name: 'is_good_work_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '잘가르쳐요',
  })
  isGoodWorkCount: number;

  @Column('int', {
    name: 'is_clear_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '깔끔해요',
  })
  isClearCount: number;

  @Column('int', {
    name: 'is_quick_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '답변이 빨라요',
  })
  isQuickCount: number;

  @Column('int', {
    name: 'is_accurate_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '정확해요',
  })
  isAccurateCount: number;

  @Column('int', {
    name: 'is_kindness_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '친절해요',
  })
  isKindnessCount: number;

  @Column('int', {
    name: 'is_fun_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '재밌어요',
  })
  isFunCount: number;

  @Column('int', {
    name: 'is_informative_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '알차요',
  })
  isInformativeCount: number;

  @Column('int', {
    name: 'is_bad_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '아쉬워요',
  })
  isBadCount: number;

  @Column('int', {
    name: 'is_stuffy_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '답답해요',
  })
  isStuffyCount: number;

  @Column('int', {
    name: 'is_understand_well_count',
    unsigned: true,
    nullable: false,
    default: 0,
    comment: '이해가 잘돼요',
  })
  isUnderstandWellCount: number;

  @CreateDateColumn({ name: 'created_at', comment: '생성일자' })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.mentorReviewChecklistCount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
