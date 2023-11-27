import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HelpMeBoard } from './help-me-board.entity';

@Entity({ name: 'mentor_board_image' })
export class HelpMeBoardImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => HelpMeBoard,
    (helpMeBoard) => helpMeBoard.helpMeBoardImages,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'mentor_board_id' })
  helpMeBoard: HelpMeBoard;

  @Column({ name: 'mentor_board_id' })
  mentorBoardId: number;

  @Column({ name: 'image_url' })
  imageUrl: string;
}
