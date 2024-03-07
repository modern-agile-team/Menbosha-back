import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserBadge } from './UserBadge';

@Entity('badge', { schema: 'ma6_menbosha_db' })
export class Badge {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '뱃지 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('varchar', { name: 'memo', nullable: true, length: 255 })
  memo: string | null;

  @OneToMany(() => UserBadge, (userBadge) => userBadge.badge)
  userBadges: UserBadge[];
}
