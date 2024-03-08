import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index('fk_banned_user_ban_user_id', ['banUserId'], {})
@Index('fk_banned_user_banned_user_id', ['bannedUserId'], {})
@Entity('banned_user', { schema: 'ma6_menbosha_db' })
export class BannedUser {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '밴된 유저 테이블 데이터 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'ban_user_id',
    comment: '밴한 어드민 고유 ID',
    unsigned: true,
  })
  banUserId: number;

  @Column('int', {
    name: 'banned_user_id',
    comment: '밴 당한 유저 고유 ID',
    unsigned: true,
  })
  bannedUserId: number;

  @Column('varchar', { name: 'reason', comment: '정지 사유', length: 200 })
  reason: string;

  @Column('timestamp', {
    name: 'banned_at',
    comment: '정지 당한 날짜',
    default: () => 'CURRENT_TIMESTAMP',
  })
  bannedAt: Date;

  @Column('datetime', {
    name: 'end_at',
    comment: '정지가 끝나는 날짜',
    nullable: true,
  })
  endAt: Date | null;

  @ManyToOne(() => User, (user) => user.banned, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'banned_user_id', referencedColumnName: 'id' }])
  bannedUser: User;

  @ManyToOne(() => User, (user) => user.bans, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ban_user_id', referencedColumnName: 'id' }])
  banUser: User;
}
