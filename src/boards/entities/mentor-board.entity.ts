import { User } from 'src/users/entities/user.entity';
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
import { MentorBoardLike } from './mentor-board-like.entity';
import { MentorBoardImage } from './mentor-board-image.entity';

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

  @OneToMany(
    () => MentorBoardImage,
    (mentorBoardImages) => mentorBoardImages.mentorBoard,
  )
  mentorBoardImages: MentorBoardImage[];

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

  @Column({ name: 'category_list_id' })
  categoryId: number;

  @ManyToOne(() => CategoryList, (categoryList) => categoryList.mentorBoard)
  @JoinColumn({ name: 'category_list_id' })
  categoryList: CategoryList;

  @OneToMany(
    () => MentorBoardLike,
    (mentorBoardLike) => mentorBoardLike.mentorBoard,
  )
  mentorBoardLike: MentorBoardLike;
}
