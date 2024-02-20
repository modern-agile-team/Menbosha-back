import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('banned_user', { schema: 'ma6_menbosha_db' })
export class BannedUser {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '밴된 유저 테이블 데이터 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'reason', comment: '정지 사유', length: 200 })
  reason: string;

  @Column('timestamp', {
    name: 'banned_at',
    comment: '정지 당한 날짜',
    default: () => 'CURRENT_TIMESTAMP',
  })
  bannedAt: Date;

  @Column('timestamp', { name: 'end_at', comment: '정지가 끝나는 날짜' })
  endAt: Date;

  @Column('int', { name: 'user_id', nullable: false, comment: '유저 고유 ID' })
  userId: number;

  @OneToOne(() => User, (user) => user.bannedUser, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
