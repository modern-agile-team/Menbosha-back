import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  Index,
  ManyToMany,
} from 'typeorm';
import { UserImage } from './user-image.entity';
import { Token } from 'src/auth/entities/token.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { UserReview } from './user-review.entity';
import { UserBadge } from './user-badge.entity';
import { CategoryList } from '../../common/entity/category-list.entity';
import { UserIntro } from './user-intro.entity';
import { TotalCount } from 'src/common/entity/total-count.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserImage, (userImage) => userImage.user)
  userImage: UserImage;

  @OneToOne(() => UserIntro, (userIntro) => userIntro.user)
  userIntro: UserIntro;

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

  @Column({ default: false })
  isMentor: boolean;

  @Column({ name: 'hope_category_list_id' }) //희망 카테고리 id
  hopeCategoryId: number;

  @Column({ name: 'activity_category_list_id' })
  activityCategoryId: number;

  @Column({ default: 10 })
  rank: number;

  @Column({ length: 20 })
  phone: string;

  @OneToMany(() => MentorBoard, (mentorBoard) => mentorBoard.user)
  @JoinColumn({ name: 'mentor_board_id' })
  mentorBoard: MentorBoard;

  @OneToMany(() => HelpMeBoard, (helpMeBoard) => helpMeBoard.user)
  @JoinColumn({ name: 'help_me_board_id' })
  helpMeBoard: HelpMeBoard;

  @OneToMany(() => UserBadge, (userBadge) => userBadge.user)
  @JoinColumn({ name: 'user_badge_id' })
  userBadge: UserBadge;

  @OneToOne(() => Token, (token) => token.user, {
    onDelete: 'CASCADE',
  })
  token: Token;

  @ManyToMany(() => CategoryList, (categoryList) => categoryList.user)
  @JoinColumn({ name: 'category_id' })
  categoryList: CategoryList;

  @OneToOne(() => TotalCount, (totalcount) => totalcount.user, {
    onDelete: 'CASCADE',
  })
  totalCount: TotalCount;
}
