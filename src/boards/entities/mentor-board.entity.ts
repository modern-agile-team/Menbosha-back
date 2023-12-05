import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryList } from 'src/common/entity/category-list.entity';

@Entity({
  name: 'mentor_board',
})
export class MentorBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.mentorBoard, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Index({ fulltext: true })
  @Column('varchar')
  head: string;

  @Index({ fulltext: true })
  @Column('text')
  body: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'category_list' })
  categoryId: number;

  @OneToOne(() => CategoryList, (categoryList) => categoryList.mentorBoard)
  @JoinColumn({ name: 'category_list' })
  categoryList: CategoryList;
}
