import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentorBoard } from './mentor-board.entity';
import { User } from '@src/users/entities/user.entity';

@Entity({ name: 'mentor_board_like' })
export class MentorBoardLike {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '멘토 게시판 좋아요 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'mentor_board_id',
    comment: '멘토 게시판 글 고유 id',
  })
  parentId: number;

  @ManyToOne(() => MentorBoard, (mentorBoard) => mentorBoard.mentorBoardLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'mentor_board_id', referencedColumnName: 'id' }])
  mentorBoard: MentorBoard;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.mentorBoardLikes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
