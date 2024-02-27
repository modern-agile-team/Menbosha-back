import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
  Index,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';
import { UserImage } from './user-image.entity';
import { Token } from 'src/auth/entities/token.entity';
import { MentorBoard } from 'src/boards/entities/mentor-board.entity';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { MentorReview } from '../../mentors/mentor-reviews/entities/mentor-review.entity';
import { UserBadge } from './user-badge.entity';
import { CategoryList } from '../../category/entity/category-list.entity';
import { UserIntro } from './user-intro.entity';
import { TotalCount } from 'src/total-count/entities/total-count.entity';
import { MentorBoardLike } from 'src/boards/entities/mentor-board-like.entity';
import { UserRanking } from './user-ranking.entity';
import { MentorReviewChecklistCount } from 'src/total-count/entities/mentor-review-checklist-count.entity';
import { Report } from 'src/users/user-reports/entities/user-report.entity';
import { BannedUser } from 'src/admins/entities/banned-user.entity';
import { UserStatus } from 'src/users/constants/user-status.enum';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserImage, (userImage) => userImage.user)
  userImage: UserImage;

  @OneToOne(
    () => MentorReviewChecklistCount,
    (mentorReviewChecklistCount) => mentorReviewChecklistCount.user,
  )
  mentorReviewChecklistCount: MentorReviewChecklistCount;

  @OneToOne(() => UserIntro, (userIntro) => userIntro.user)
  userIntro: UserIntro;

  @OneToMany(() => MentorReview, (mentorReview) => mentorReview.mentor)
  mentor: MentorReview;

  @OneToMany(() => MentorReview, (mentorReview) => mentorReview.mentee)
  mentee: MentorReview;

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

  @Column({
    name: 'hope_category_list_id',
    default: 1,
    unsigned: true,
    nullable: false,
  }) //희망 카테고리 id
  hopeCategoryId: number;

  @Column({
    name: 'activity_category_list_id',
    default: 1,
    unsigned: true,
    nullable: false,
  })
  activityCategoryId: number;

  @Column({ default: 10 })
  rank: number;

  @Column({ length: 20 })
  phone: string;

  @Column('enum', {
    nullable: false,
    name: 'status',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    comment: '유저 상태',
  })
  status: UserStatus;

  @Column('datetime', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'updated_at',
    comment: '수정 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @Column('varchar', {
    name: 'unique_id',
    length: '100',
    nullable: true,
  })
  uniqueId: string | null;

  @OneToMany(() => MentorBoard, (mentorBoard) => mentorBoard.user)
  @JoinColumn({ name: 'mentor_board_id' })
  mentorBoard: MentorBoard;

  @OneToMany(() => MentorBoardLike, (mentorBoardLike) => mentorBoardLike.user)
  mentorBoardLikes: MentorBoardLike[];

  @OneToMany(() => HelpMeBoard, (helpMeBoard) => helpMeBoard.user)
  @JoinColumn({ name: 'help_me_board_id' })
  helpMeBoard: HelpMeBoard;

  @OneToMany(() => UserBadge, (userBadge) => userBadge.user)
  @JoinColumn({ name: 'user_badge_id' })
  userBadge: UserBadge;

  @OneToOne(() => Token, (token) => token.user)
  token: Token;

  @ManyToMany(() => CategoryList, (categoryList) => categoryList.user)
  @JoinColumn({ name: 'category_id' })
  categoryList: CategoryList;

  @OneToOne(() => TotalCount, (totalcount) => totalcount.user)
  totalCount: TotalCount;

  @OneToMany(() => UserRanking, (userRanking) => userRanking.user)
  userRanking: UserRanking;

  @OneToMany(() => Report, (reports) => reports.user)
  reports: Report[];

  @OneToOne(() => BannedUser, (bannedUser) => bannedUser.user)
  bannedUser: BannedUser;
}
