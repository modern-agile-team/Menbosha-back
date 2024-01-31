import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BadgeList } from '../../common/entity/badge-list.entity';

@Entity({ name: 'user_badge' })
export class UserBadge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'badge_id' })
  badgeId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

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
