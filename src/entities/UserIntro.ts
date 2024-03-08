import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index('UQ_user_intro_user_id', ['userId'], { unique: true })
@Entity('user_intro', { schema: 'ma6_menbosha_db' })
export class UserIntro {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 인트로',
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

  @Column('varchar', {
    name: 'career',
    comment: '유저 커리어',
    length: 200,
    default: () => "'나를 어필할만한 경력을 작성해주세요.'",
  })
  career: string;

  @Column('varchar', {
    name: 'short_intro',
    comment: '유저 짧은 소개',
    length: 50,
    default: () => "'나를 간단하게 소개해봐요.'",
  })
  shortIntro: string;

  @Column('varchar', {
    name: 'custom_category',
    comment: '유저 커스텀 카테고리',
    length: 200,
    default: () => "'나만의 카테고리를 작성해주세요.'",
  })
  customCategory: string;

  @Column('varchar', {
    name: 'detail',
    comment: '유저 상세 소개',
    length: 200,
    default: () => "'내가 어떤 사람인지 자세하게 작성해주세요.'",
  })
  detail: string;

  @Column('varchar', {
    name: 'portfolio',
    comment: '유저 포트폴리오',
    length: 100,
    default: () => "'나를 소개할 수 있는 링크가 있다면 추가해주세요.'",
  })
  portfolio: string;

  @Column('varchar', {
    name: 'sns',
    comment: '유저 SNS 링크',
    length: 100,
    default: () => "'SNS 계정의 링크를 추가해주세요.'",
  })
  sns: string;

  @OneToOne(() => User, (user) => user.userIntro, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
