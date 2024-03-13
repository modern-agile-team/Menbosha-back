import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';
import { User } from '@src/entities/User';

@Index('FK_mentor_review_mentee_id', ['menteeId'], {})
@Index('FK_mentor_review_mentor_id', ['mentorId'], {})
@Entity('mentor_review')
export class MentorReview {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '멘토 리뷰 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', { name: 'mentor_id', comment: '멘토 고유 ID', unsigned: true })
  mentorId: number;

  @Column('int', { name: 'mentee_id', comment: '멘티 고유 ID', unsigned: true })
  menteeId: number;

  @Column('varchar', {
    name: 'review',
    nullable: true,
    comment: '멘토링 상세 후기',
    length: 200,
  })
  review: string | null;

  @Column('tinyint', {
    name: 'is_good_work',
    comment: '잘가르쳐요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isGoodWork: boolean;

  @Column('tinyint', {
    name: 'is_clear',
    comment: '깔끔해요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isClear: boolean;

  @Column('tinyint', {
    name: 'is_quick',
    comment: '답변이 빨라요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isQuick: boolean;

  @Column('tinyint', {
    name: 'is_accurate',
    comment: '정확해요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isAccurate: boolean;

  @Column('tinyint', {
    name: 'is_kindness',
    comment: '친절해요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isKindness: boolean;

  @Column('tinyint', {
    name: 'is_fun',
    comment: '재밌어요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isFun: boolean;

  @Column('tinyint', {
    name: 'is_informative',
    comment: '알차요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isInformative: boolean;

  @Column('tinyint', {
    name: 'is_bad',
    comment: '아쉬워요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isBad: boolean;

  @Column('tinyint', {
    name: 'is_stuffy',
    comment: '답답해요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isStuffy: boolean;

  @Column('tinyint', {
    name: 'is_understand_well',
    comment: '이해가 잘돼요',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isUnderstandWell: boolean;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.reviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mentee_id', referencedColumnName: 'id' }])
  mentee: User;

  @ManyToOne(() => User, (user) => user.reviewed, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mentor_id', referencedColumnName: 'id' }])
  mentor: User;
}
