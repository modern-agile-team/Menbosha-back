import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserBadgeMapping } from './user-badge.entity';

@Entity({ name: 'badge_list' })
export class BadgeList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'badge_name' })
  badgeName: string;

  @Column({ name: 'memo' })
  memo: string;

  @OneToMany(
    () => UserBadgeMapping,
    (userBadgeMapping) => userBadgeMapping.badge,
  )
  @JoinColumn({ name: 'userBadgeMapping_id' })
  userBadgeMapping: UserBadgeMapping;
}
