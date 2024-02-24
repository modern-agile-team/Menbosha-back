import { User } from '@src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoryList } from '@src/category/entity/category-list.entity';
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

  @Column('datetime', {
    name: 'popular_at',
    nullable: true,
    comment: '인기 게시글 선정 일자',
  })
  popularAt: Date | null;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @Column({ name: 'category_list_id' })
  categoryId: number;

  @ManyToOne(() => CategoryList, (categoryList) => categoryList.mentorBoard, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_list_id' })
  categoryList: CategoryList;

  @OneToMany(
    () => MentorBoardLike,
    (mentorBoardLike) => mentorBoardLike.mentorBoard,
  )
  mentorBoardLikes: MentorBoardLike[];
}
