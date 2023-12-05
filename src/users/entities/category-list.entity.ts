import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'category_list' })
export class CategoryList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_name' })
  categoryName: string;

  @OneToOne(() => User, (user) => user.categoryList)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
