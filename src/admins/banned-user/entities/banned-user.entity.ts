import { User } from '@src/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('banned_user')
export class BannedUser {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '밴된 유저 테이블 데이터 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'reason', comment: '정지 사유', length: 255 })
  reason: string;

  @Column('timestamp', {
    name: 'banned_at',
    comment: '정지 당한 날짜',
    default: () => 'CURRENT_TIMESTAMP',
  })
  bannedAt: Date;

  @Column('datetime', { name: 'end_at', comment: '정지가 끝나는 날짜' })
  endAt: Date;

  @Column('int', {
    name: 'ban_user_id',
    nullable: false,
    comment: '밴한 어드민 고유 ID',
  })
  banUserId: number;

  @ManyToOne(() => User, (user) => user.bans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ban_user_id', referencedColumnName: 'id' }])
  banUser: User;

  @Index({ unique: true })
  @Column('int', {
    unique: true,
    name: 'banned_user_id',
    nullable: false,
    comment: '밴 당한 유저 고유 ID',
  })
  bannedUserId: number;

  @OneToOne(() => User, (user) => user.banned, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'banned_user_id', referencedColumnName: 'id' }])
  bannedUser: User;
}
