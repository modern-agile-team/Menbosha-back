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

  @Column({ name: 'short_intro' })
  shortIntro: string;

  @Column({ name: 'career' })
  career: string;

  @Column({ name: 'custom_category' })
  customCategory: string;

  @Column({ name: 'detail' })
  detail: string;

  @Column({ name: 'portfolio' })
  portfolio: string;

  @Column({ name: 'sns' })
  sns: string;

  @OneToOne(() => User, (user: User) => user.userIntro, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
