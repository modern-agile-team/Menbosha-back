import { MentorBoard } from '@src/entities/MentorBoard';
import { User } from '@src/entities/User';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FK_mentor_board_like_mentor_board_id', ['parentId'], {})
@Index('FK_mentor_board_like_user_id', ['userId'], {})
@Entity('mentor_board_like')
export class MentorBoardLike {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '멘토 게시글 좋아요 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', { name: 'user_id', comment: '유저 고유 ID', unsigned: true })
  userId: number;

  @Column('int', {
    name: 'mentor_board_id',
    comment: '멘토 게시글 고유 ID',
    unsigned: true,
  })
  parentId: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => MentorBoard, (mentorBoard) => mentorBoard.mentorBoardLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mentor_board_id', referencedColumnName: 'id' }])
  mentorBoard: MentorBoard;

  @ManyToOne(() => User, (user) => user.mentorBoardLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
