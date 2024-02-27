import { HelpMeBoard } from '@src/boards/entities/help-me-board.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
