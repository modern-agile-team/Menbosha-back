import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentorBoard } from '../../entities/mentor-board.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'mentor_board_like' })
export class MentorBoardLike {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '멘토 게시판 좋아요 ID',
    unsigned: true,
  })
  id: number;

  @ManyToOne(() => MentorBoard, (mentorBoard) => mentorBoard.mentorBoardLike, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'mentor_board_id', referencedColumnName: 'id' }])
  mentorBoard: MentorBoard;

  @ManyToOne(() => User, (user) => user.mentorBoardLike, {
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
