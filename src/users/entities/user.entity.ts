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
import { Board } from 'src/boards/entities/board.entity';
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

  @OneToMany(() => Board, (board) => board.user)
  @JoinColumn({ name: 'board_id' })
  board: Board;

  @OneToOne(() => Token, (token) => token.user, {
    onDelete: 'CASCADE',
  })
  token: Token;
}
