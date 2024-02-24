import { User } from '@src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'token' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'social_access_token' })
  socialAccessToken: string;

  @Column({ name: 'social_refresh_token' })
  socialRefreshToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @OneToOne(() => User, (userId: User) => userId.token, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
