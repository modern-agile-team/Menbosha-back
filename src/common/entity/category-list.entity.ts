import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';

@Entity({ name: 'category_list' })
export class CategoryList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_name' })
  categoryName: string;

  @OneToMany(() => User, (user) => user.categoryList)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => HelpMeBoard, (helpMeBoard) => helpMeBoard.categoryList)
  @JoinColumn({ name: 'help_me_board_id' })
  helpMeBoard: HelpMeBoard;

  @OneToMany(() => MentorBoard, (mentorBoard) => mentorBoard.categoryList)
  @JoinColumn({ name: 'mentor_board_id' })
  mentorBoard: MentorBoard;
}
