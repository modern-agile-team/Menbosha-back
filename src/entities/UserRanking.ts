import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category';
import { User } from './User';

@Index('FK_user_ranking_activity_category_id', ['activityCategoryId'], {})
@Index('UQ_user_ranking_user_id', ['userId'], { unique: true })
@Entity('user_ranking', { schema: 'ma6_menbosha_db' })
export class UserRanking {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 랭킹 고유 ID',
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
    name: 'activity_category_id',
    nullable: true,
    comment: '유저 활동 카테고리 고유 ID',
    unsigned: true,
  })
  activityCategoryId: number | null;

  @Column('varchar', {
    name: 'name',
    nullable: true,
    comment: '유저 이름',
    length: 20,
  })
  name: string | null;

  @Column('varchar', {
    name: 'career',
    nullable: true,
    comment: '유저 커리어',
    length: 200,
  })
  career: string | null;

  @Column('smallint', {
    name: 'rank',
    nullable: true,
    comment: '유저 랭크',
    unsigned: true,
  })
  rank: number | null;

  @Column('int', {
    name: 'review_count',
    nullable: true,
    comment: '유저 리뷰받은 개수',
    unsigned: true,
  })
  reviewCount: number | null;

  @Column('varchar', {
    name: 'short_intro',
    nullable: true,
    comment: '유저 짧은 소개',
    length: 50,
  })
  shortIntro: string | null;

  @Column('varchar', {
    name: 'custom_category',
    nullable: true,
    comment: '유저 짧은 소개',
    length: 200,
  })
  customCategory: string | null;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => Category, (category) => category.userRankings, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'activity_category_id', referencedColumnName: 'id' }])
  activityCategory: Category;

  @OneToOne(() => User, (user) => user.userRanking, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
