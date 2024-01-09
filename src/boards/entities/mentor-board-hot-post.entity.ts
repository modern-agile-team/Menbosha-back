import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentorBoard } from './mentor-board.entity';

@Entity({ name: 'mentor_board_hot_post' })
export class MentorBoardHotPost {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '멘토 게시판 hot 게시글',
    unsigned: true,
  })
  id: number;

  @OneToOne(
    () => MentorBoard,
    (mentorBoard) => mentorBoard.mentorBoardHotPost,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'mentor_board_id' })
  mentorBoard: MentorBoard;

  @Column({
    name: 'mentor_board_id',
    comment: '멘토 게시판 글 고유 id',
  })
  mentorBoardId: number;

  @Column('int', {
    name: 'like_count',
    comment: '좋아요 개수',
    unsigned: true,
  })
  likeCount: number;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;
}
