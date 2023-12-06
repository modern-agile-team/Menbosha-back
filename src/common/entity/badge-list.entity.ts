import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBadge } from '../../users/entities/user-badge.entity';

@Entity({ name: 'badge_list' })
export class BadgeList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'badge_name' })
  badgeName: string;

  @Column({ name: 'memo' })
  memo: string;

  @OneToMany(() => UserBadge, (userBadge) => userBadge.badge)
  @JoinColumn({ name: 'userBadge_id' })
  userBadge: UserBadge;
}
