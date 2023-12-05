import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BadgeList } from './badge-list.entity';

@Entity({ name: 'user_badge_mapping' })
export class UserBadgeMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'badge_id' })
  badgeId: number;

  @Column({ name: 'created_at' })
  creataedAt: Date;

  @ManyToOne(() => User, (userId: User) => userId.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => BadgeList, (badgeId: BadgeList) => badgeId.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'badge_id' })
  badge: BadgeList;
}
