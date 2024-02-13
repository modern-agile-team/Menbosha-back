import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { BooleanTransformer } from 'src/common/entity/transformers/boolean.transformer';

@Entity({ name: 'mentor_review' })
export class MentorReview {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column({ name: 'mentor_id' })
  mentorId: number;

  @Column({ name: 'mentee_id' })
  menteeId: number;

  @ManyToOne(() => User, (user) => user.mentor, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'mentor_id' })
  mentor: User;

  @ManyToOne(() => User, (user) => user.mentee, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'mentee_id' })
  mentee: User;

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

  @Column('varchar', { name: 'review', length: 255, nullable: true })
  review: string | null;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;
}
