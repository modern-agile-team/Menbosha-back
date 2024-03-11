import { Badge } from '@src/entities/Badge';
import { User } from '@src/entities/User';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FK_user_badge_badge_id', ['badgeId'], {})
@Index('FK_user_badge_user_id', ['userId'], {})
@Entity('user_badge')
export class UserBadge {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 뱃지 매핑테이블 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '뱃지 획득한 유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', { name: 'badge_id', comment: '뱃지 고유 ID', unsigned: true })
  badgeId: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Badge, (badge) => badge.userBadges, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'badge_id', referencedColumnName: 'id' }])
  badge: Badge;

  @ManyToOne(() => User, (user) => user.userBadges, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
