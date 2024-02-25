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
import { Token } from '@src/auth/entities/token.entity';
import { MentorBoard } from '@src/boards/entities/mentor-board.entity';
import { HelpMeBoard } from '@src/boards/entities/help-me-board.entity';
import { TotalCount } from '@src/total-count/entities/total-count.entity';
import { MentorBoardLike } from '@src/boards/entities/mentor-board-like.entity';
import { MentorReviewChecklistCount } from '@src/total-count/entities/mentor-review-checklist-count.entity';
import { Report } from '@src/reports/entities/report.entity';
import { BannedUser } from '@src/admins/banned-user/entities/banned-user.entity';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { Provider } from '@src/auth/enums/provider.enum';
import { BooleanTransformer } from '@src/common/entity/transformers/boolean.transformer';
import { UserRole } from '@src/users/constants/user-role.enum';
import { UserBadge } from '@src/users/entities/user-badge.entity';
import { UserImage } from '@src/users/entities/user-image.entity';
import { UserIntro } from '@src/users/entities/user-intro.entity';
import { UserRanking } from '@src/users/entities/user-ranking.entity';
import { CategoryList } from '@src/category/entity/category-list.entity';
import { MentorReview } from '@src/mentors/mentor-reviews/entities/mentor-review.entity';

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
  provider: Provider;

  @Index({ fulltext: true })
  @Column('varchar', { length: 20 })
  name: string;

  @Column({ length: 100 })
  email: string;

  @Column('enum', {
    name: 'role',
    default: UserRole.USER,
    enum: UserRole,
    nullable: false,
    comment: '유저 역할',
  })
  role: UserRole;

  @Column('tinyint', {
    name: 'is_mentor',
    unsigned: true,
    nullable: false,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
    comment: '멘토 여부 (0: 멘티, 1: 멘토)',
  })
  isMentor: boolean;

  @Column({ name: 'hope_category_list_id' }) //희망 카테고리 id
  hopeCategoryId: number;

  @Column({ name: 'activity_category_list_id' })
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

  @OneToMany(() => Report, (reports) => reports.reportUser)
  reports: Report[];

  @OneToMany(() => Report, (reports) => reports.reportedUser)
  reported: Report[];

  @OneToMany(() => BannedUser, (bannedUser) => bannedUser.banUser)
  bans: BannedUser[];

  @OneToOne(() => BannedUser, (bannedUser) => bannedUser.bannedUser)
  banned: BannedUser;
}
