import { User } from '@src/entities/User';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('UQ_token_user_id', ['userId'], { unique: true })
@Entity('token')
export class Token {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '토큰 고유 ID',
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
    name: 'social_access_token',
    comment: '소셜 액세스 토큰',
    length: 255,
  })
  socialAccessToken: string;

  @Column('varchar', {
    name: 'social_refresh_token',
    comment: '소셜 리프레쉬 토큰',
    length: 255,
  })
  socialRefreshToken: string;

  @Column('varchar', {
    name: 'refresh_token',
    comment: '리프레쉬 토큰',
    length: 255,
  })
  refreshToken: string;

  @OneToOne(() => User, (user) => user.token, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
