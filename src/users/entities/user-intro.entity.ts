import { User } from '@src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user_intro' })
export class UserIntro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column('varchar', {
    name: 'short_intro',
    default: '나를 간단하게 소개해봐요.',
    nullable: false,
  })
  shortIntro: string;

  @Column('varchar', {
    name: 'career',
    default: '나를 어필할만한 경력을 작성해주세요.',
    nullable: false,
  })
  career: string;

  @Column('varchar', {
    name: 'custom_category',
    default: '나만의 카테고리를 작성해주세요.',
    nullable: false,
  })
  customCategory: string;

  @Column('varchar', {
    name: 'detail',
    default: '내가 어떤 사람인지 자세하게 작성해주세요.',
    nullable: false,
  })
  detail: string;

  @Column('varchar', {
    name: 'portfolio',
    default: '나를 소개할 수 있는 링크가 있다면 추가해주세요.',
    nullable: false,
  })
  portfolio: string;

  @Column('varchar', {
    name: 'sns',
    default: 'SNS 계정의 링크를 추가해주세요.',
    nullable: false,
  })
  sns: string;

  @OneToOne(() => User, (user: User) => user.userIntro, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
