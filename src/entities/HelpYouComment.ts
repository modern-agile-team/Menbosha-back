import { HelpMeBoard } from '@src/entities/HelpMeBoard';
import { User } from '@src/entities/User';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FK_help_you_comment_help_me_board_id', ['helpMeBoardId'], {})
@Index('FK_help_you_comment_user_id', ['userId'], {})
@Entity('help_you_comment')
export class HelpYouComment {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '도와줄게요 댓글 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'user_id',
    comment: '도와줄게요 댓글 작성자 고유 ID',
    unsigned: true,
  })
  userId: number;

  @Column('int', {
    name: 'help_me_board_id',
    comment: '도와주세요 게시글 고유 ID',
    unsigned: true,
  })
  helpMeBoardId: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => HelpMeBoard, (helpMeBoard) => helpMeBoard.helpYouComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'help_me_board_id', referencedColumnName: 'id' }])
  helpMeBoard: HelpMeBoard;

  @ManyToOne(() => User, (user) => user.helpYouComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
