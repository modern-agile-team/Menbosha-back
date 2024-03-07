import { MentorBoard } from '@src/boards/entities/mentor-board.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'mentor_board_image' })
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
  @JoinColumn({ name: 'mentor_board_id' })
  mentorBoard: MentorBoard;

  @Column({ name: 'mentor_board_id' })
  mentorBoardId: number;

  @Column({ name: 'image_url' })
  imageUrl: string;
}
