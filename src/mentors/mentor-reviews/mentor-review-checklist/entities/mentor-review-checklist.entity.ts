import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentorReview } from '../../entities/mentor-review.entity';
import { BooleanTransformer } from '../../../../common/entity/transformers/boolean.transformer';

@Entity('mentor_review_checklist', { schema: 'ma6_menbosha_db' })
export class MentorReviewChecklist {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '리뷰 체크리스트 고유 ID',
    unsigned: true,
  })
  id: number;

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

  @Column('int', {
    name: 'mentor_review_id',
    unsigned: true,
  })
  mentorReviewId: number;

  @OneToOne(
    () => MentorReview,
    (mentorReview) => mentorReview.mentorReviewChecklist,
    {
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
  )
  @JoinColumn([{ name: 'mentor_review_id', referencedColumnName: 'id' }])
  mentorReview: MentorReview;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;
}
