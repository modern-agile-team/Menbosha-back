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

@Index('UQ_mentor_review_checklist_count_mentor_id', ['mentorId'], {
  unique: true,
})
@Entity('mentor_review_checklist_count')
export class MentorReviewChecklistCount {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '멘토 리뷰 체크리스트 카운트 고유ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'mentor_id',
    unique: true,
    comment: '멘토 리뷰 체크리스트 카운트 소유 멘토 고유 ID',
    unsigned: true,
  })
  mentorId: number;

  @Column('int', {
    name: 'is_good_work_count',
    comment: '잘가르쳐요',
    unsigned: true,
    default: () => "'0'",
  })
  isGoodWorkCount: number;

  @Column('int', {
    name: 'is_clear_count',
    comment: '깔끔해요',
    unsigned: true,
    default: () => "'0'",
  })
  isClearCount: number;

  @Column('int', {
    name: 'is_quick_count',
    comment: '답변이 빨라요',
    unsigned: true,
    default: () => "'0'",
  })
  isQuickCount: number;

  @Column('int', {
    name: 'is_accurate_count',
    comment: '정확해요',
    unsigned: true,
    default: () => "'0'",
  })
  isAccurateCount: number;

  @Column('int', {
    name: 'is_kindness_count',
    comment: '친절해요',
    unsigned: true,
    default: () => "'0'",
  })
  isKindnessCount: number;

  @Column('int', {
    name: 'is_fun_count',
    comment: '재밌어요',
    unsigned: true,
    default: () => "'0'",
  })
  isFunCount: number;

  @Column('int', {
    name: 'is_informative_count',
    comment: '알차요',
    unsigned: true,
    default: () => "'0'",
  })
  isInformativeCount: number;

  @Column('int', {
    name: 'is_bad_count',
    comment: '아쉬워요',
    unsigned: true,
    default: () => "'0'",
  })
  isBadCount: number;

  @Column('int', {
    name: 'is_stuffy_count',
    comment: '답답해요',
    unsigned: true,
    default: () => "'0'",
  })
  isStuffyCount: number;

  @Column('int', {
    name: 'is_understand_well_count',
    comment: '이해가 잘돼요',
    unsigned: true,
    default: () => "'0'",
  })
  isUnderstandWellCount: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @OneToOne(() => User, (user) => user.mentorReviewChecklistCount, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mentor_id', referencedColumnName: 'id' }])
  mentor: User;
}
