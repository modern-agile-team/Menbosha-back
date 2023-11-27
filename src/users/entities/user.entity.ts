import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  Index,
} from 'typeorm';
import { UserImage } from './user-image.entity';
import { Token } from 'src/auth/entities/token.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { UserReview } from './user-review.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserImage, (userImage) => userImage.user)
  userImage: UserImage;

  @OneToOne(() => UserReview, (userReview) => userReview.mentor)
  mentor: UserReview;

  @OneToOne(() => UserReview, (userReview) => userReview.mentee)
  mentee: UserReview;

  @Column({ length: 10 })
  provider: string;

  @Index({ fulltext: true })
  @Column('varchar', { length: 20 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column({ default: false })
  admin: boolean;

  @Column({ length: 20 })
  category: string;

  @Column({ length: 20 })
  badge: string;

  @Column({ length: 10 })
  rank: number;

  // @OneToMany(() => Board, (board) => board.user)
  // @JoinColumn({ name: 'board_id' })
  // board: Board;

  @OneToMany(() => MentorBoard, (mentorBoard) => mentorBoard.user)
  @JoinColumn({ name: 'mentor_board_id' })
  mentorBoard: MentorBoard;

  @OneToMany(() => HelpMeBoard, (helpMeBoard) => helpMeBoard.user)
  @JoinColumn({ name: 'help_me_board_id' })
  helpMeBoard: HelpMeBoard;

  @OneToOne(() => Token, (token) => token.user, {
    onDelete: 'CASCADE',
  })
  token: Token;
}
