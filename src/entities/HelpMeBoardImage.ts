import { HelpMeBoard } from '@src/entities/HelpMeBoard';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index('FK_help_me_board_image_help_me_board_id', ['helpMeBoardId'], {})
@Entity('help_me_board_image')
export class HelpMeBoardImage {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '도와주세요 게시글 이미지 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'help_me_board_id',
    comment: '도와주세요 게시글 고유 ID',
    unsigned: true,
  })
  helpMeBoardId: number;

  @Column('varchar', { name: 'image_url', comment: '이미지 url', length: 255 })
  imageUrl: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => HelpMeBoard,
    (helpMeBoard) => helpMeBoard.helpMeBoardImages,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'help_me_board_id', referencedColumnName: 'id' }])
  helpMeBoard: HelpMeBoard;
}
