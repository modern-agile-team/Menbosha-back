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
import { Category } from './Category';
import { User } from './User';
import { HelpMeBoardImage } from './HelpMeBoardImage';
import { HelpYouComment } from './HelpYouComment';

@Index('FK_help_me_board_category_id', ['categoryId'], {})
@Index('FK_help_me_board_user_id', ['userId'], {})
@Index('IDX_fulltext_head_body', ['head', 'body'], { fulltext: true })
@Entity('help_me_board', { schema: 'ma6_menbosha_db' })
export class HelpMeBoard {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '도와주세요 게시글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'category_id',
    comment: '카테고리 고유 ID',
    unsigned: true,
  })
  categoryId: number;

  @Column('int', {
    name: 'user_id',
    comment: '게시글 작성 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('varchar', {
    name: 'head',
    comment: '도와주세요 게시글 제목',
    length: 30,
  })
  head: string;

  @Column('text', { name: 'body', comment: '도와주세요 게시글 본문' })
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
    name: 'pulling_up',
    nullable: true,
    comment: '도와주세요 게시글 끌어올리기 일시',
  })
  pullingUp: Date | null;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => Category, (category) => category.helpMeBoards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;

  @ManyToOne(() => User, (user) => user.helpMeBoards, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(
    () => HelpMeBoardImage,
    (helpMeBoardImage) => helpMeBoardImage.helpMeBoard,
  )
  helpMeBoardImages: HelpMeBoardImage[];

  @OneToMany(
    () => HelpYouComment,
    (helpYouComment) => helpYouComment.helpMeBoard,
  )
  helpYouComments: HelpYouComment[];
}
