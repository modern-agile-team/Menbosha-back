import { Category } from '@src/entities/Category';
import { MentorBoardImage } from '@src/entities/MentorBoardImage';
import { MentorBoardLike } from '@src/entities/MentorBoardLike';
import { User } from '@src/entities/User';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FK_mentor_board_category_id', ['categoryId'], {})
@Index('FK_mentor_board_user_id', ['userId'], {})
@Index('IDX_fulltext_head_body', ['head', 'body'], { fulltext: true })
@Entity('mentor_board')
export class MentorBoard {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '멘토 게시글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '멘토 게시글 작성자 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'category_id',
    comment: '카테고리 고유 ID',
    unsigned: true,
  })
  categoryId: number;

  @Column('varchar', { name: 'head', comment: '멘토 게시글 제목', length: 50 })
  head: string;

  @Column('text', { name: 'body', comment: '멘토 게시글 본문' })
  body: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column('timestamp', {
    name: 'popular_at',
    nullable: true,
    comment: '인기 게시글 선정 시간',
  })
  popularAt: Date | null;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => Category, (category) => category.mentorBoards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;

  @ManyToOne(() => User, (user) => user.mentorBoards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => MentorBoardImage,
    (mentorBoardImage) => mentorBoardImage.mentorBoard,
  )
  mentorBoardImages: MentorBoardImage[];

  @OneToMany(
    () => MentorBoardLike,
    (mentorBoardLike) => mentorBoardLike.mentorBoard,
  )
  mentorBoardLikes: MentorBoardLike[];
}
