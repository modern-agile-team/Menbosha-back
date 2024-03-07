import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@Index('UQ_user_image_user_id', ['userId'], { unique: true })
@Entity('user_image', { schema: 'ma6_menbosha_db' })
export class UserImage {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 이미지 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    unique: true,
    comment: '유저 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('varchar', { name: 'image_url', comment: '이미지 url', length: 100 })
  imageUrl: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToOne(() => User, (user) => user.userImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
