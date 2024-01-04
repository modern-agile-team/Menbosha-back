import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentorBoard } from './mentor-board.entity';

@Entity({ name: 'help_me_board_image' })
export class MentorBoardImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => MentorBoard,
    (mentorBoard) => mentorBoard.mentorBoardImages,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'help_me_board_id' })
  mentorBoard: MentorBoard;

  @Column({ name: 'help_me_board_id' })
  mentorBoardId: number;

  @Column({ name: 'image_url' })
  imageUrl: string;
}
