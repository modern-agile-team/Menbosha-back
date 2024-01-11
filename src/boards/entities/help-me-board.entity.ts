import { User } from 'src/users/entities/user.entity';
import { HelpMeBoardImage } from './help-me-board-image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryList } from 'src/common/entity/category-list.entity';

@Entity({
  name: 'help_me_board',
})
export class HelpMeBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.helpMeBoard, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => HelpMeBoardImage,
    (helpMeBoardImages) => helpMeBoardImages.helpMeBoard,
  )
  helpMeBoardImages: HelpMeBoardImage[];

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

  @CreateDateColumn({ name: 'pulling_up' })
  pullingUp: Date;

  @Column({ name: 'category_list_id' })
  categoryId: number;

  @ManyToOne(() => CategoryList, (categoryList) => categoryList.helpMeBoard)
  @JoinColumn({ name: 'category_list_id' })
  categoryList: CategoryList;
}
