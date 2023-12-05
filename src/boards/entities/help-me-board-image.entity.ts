import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HelpMeBoard } from './help-me-board.entity';

@Entity({ name: 'help_me_board_image' })
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
  @JoinColumn({ name: 'help_me_board_id' })
  helpMeBoard: HelpMeBoard;

  @Column({ name: 'help_me_board_id' })
  helpMeBoardId: number;

  @Column({ name: 'image_url' })
  imageUrl: string;
}
