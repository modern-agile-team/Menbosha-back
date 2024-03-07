import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MentorBoard } from './MentorBoard';

@Index('FK_mentor_board_image_mentor_board_id', ['mentorBoardId'], {})
@Entity('mentor_board_image', { schema: 'ma6_menbosha_db' })
export class MentorBoardImage {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '멘토 게시글 이미지 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'mentor_board_id',
    comment: '멘토 게시글 고유 ID',
    unsigned: true,
  })
  mentorBoardId: number;

  @Column('varchar', { name: 'image_url', comment: '이미지 url', length: 100 })
  imageUrl: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(
    () => MentorBoard,
    (mentorBoard) => mentorBoard.mentorBoardImages,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn([{ name: 'mentor_board_id', referencedColumnName: 'id' }])
  mentorBoard: MentorBoard;
}
