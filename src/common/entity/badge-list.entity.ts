import { UserBadge } from '@src/users/entities/user-badge.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
