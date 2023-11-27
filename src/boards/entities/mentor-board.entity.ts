import { User } from 'src/users/entities/user.entity';
import { MentorBoardImage } from './mentor-board-image.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'mentor_board',
})
export class MentorBoard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.board, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(
    () => MentorBoardImage,
    (mentorBoardImage) => mentorBoardImage.mentorBoard,
  )
  mentorBoardImages: MentorBoardImage[];

  @Index({ fulltext: true })
  @Column('varchar')
  head: string;

  @Index({ fulltext: true })
  @Column('text')
  body: string;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updateAt: Date;
}
