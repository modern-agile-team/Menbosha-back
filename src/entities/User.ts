import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BannedUser } from './BannedUser';
import { HelpMeBoard } from './HelpMeBoard';
import { HelpYouComment } from './HelpYouComment';
import { MentorBoard } from './MentorBoard';
import { MentorBoardLike } from './MentorBoardLike';
import { MentorReview } from './MentorReview';
import { MentorReviewChecklistCount } from './MentorReviewChecklistCount';
import { Report } from './Report';
import { Token } from './Token';
import { TotalCount } from './TotalCount';
import { Category } from './Category';
import { UserBadge } from './UserBadge';
import { UserImage } from './UserImage';
import { UserIntro } from './UserIntro';
import { UserRanking } from './UserRanking';
import { UserStatus } from '@src/users/constants/user-status.enum';
import { UserRole } from '@src/users/constants/user-role.enum';
import { UserProvider } from '@src/auth/enums/user-provider.enum';
import { BooleanTransformer } from '@src/entities/transformers/boolean.transformer';

@Index('FK_user_activity_category_id', ['activityCategoryId'], {})
@Index('FK_user_hope_category_id', ['hopeCategoryId'], {})
@Index('IDX_fulltext_name', ['name'], { fulltext: true })
@Index('UQ_user_unique_id', ['uniqueId'], { unique: true })
@Entity('user', { schema: 'ma6_menbosha_db' })
export class User {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '유저 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'hope_category_id',
    comment: '유저 희망 카테고리 고유 ID',
    unsigned: true,
    default: () => "'1'",
  })
  hopeCategoryId: number;

  @Column('int', {
    name: 'activity_category_id',
    comment: '유저 활동 카테고리 고유 ID',
    unsigned: true,
    default: () => "'1'",
  })
  activityCategoryId: number;

  @Column('enum', {
    name: 'provider',
    comment: '유저 제공자',
    enum: UserProvider,
  })
  provider: UserProvider;

  @Column('varchar', { name: 'name', comment: '유저 이름', length: 20 })
  name: string;

  @Column('varchar', { name: 'email', comment: '유저 이메일', length: 50 })
  email: string;

  @Column('smallint', {
    name: 'rank',
    comment: '유저 랭크',
    unsigned: true,
    default: () => "'10'",
  })
  rank: number;

  @Column('varchar', {
    name: 'phone',
    nullable: true,
    comment: '유저 핸드폰 번호',
    length: 20,
  })
  phone: string | null;

  @Column('enum', {
    name: 'status',
    comment: '유저 상태',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column('varchar', { name: 'unique_id', unique: true, length: 100 })
  uniqueId: string;

  @Column('tinyint', {
    name: 'is_mentor',
    comment: '멘토 여부 (0: 멘티, 1: 멘토)',
    unsigned: true,
    default: () => "'0'",
    transformer: new BooleanTransformer(),
  })
  isMentor: boolean;

  @Column('enum', {
    name: 'role',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column('timestamp', {
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
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @OneToMany(() => BannedUser, (bannedUser) => bannedUser.bannedUser)
  banned: BannedUser[];

  @OneToMany(() => BannedUser, (bannedUser) => bannedUser.banUser)
  bans: BannedUser[];

  @OneToMany(() => HelpMeBoard, (helpMeBoard) => helpMeBoard.user)
  helpMeBoards: HelpMeBoard[];

  @OneToMany(() => HelpYouComment, (helpYouComment) => helpYouComment.user)
  helpYouComments: HelpYouComment[];

  @OneToMany(() => MentorBoard, (mentorBoard) => mentorBoard.user)
  mentorBoards: MentorBoard[];

  @OneToMany(() => MentorBoardLike, (mentorBoardLike) => mentorBoardLike.user)
  mentorBoardLikes: MentorBoardLike[];

  @OneToMany(() => MentorReview, (mentorReview) => mentorReview.mentee)
  reviews: MentorReview[];

  @OneToMany(() => MentorReview, (mentorReview) => mentorReview.mentor)
  reviewed: MentorReview[];

  @OneToOne(
    () => MentorReviewChecklistCount,
    (mentorReviewChecklistCount) => mentorReviewChecklistCount.mentor,
  )
  mentorReviewChecklistCount: MentorReviewChecklistCount;

  @OneToMany(() => Report, (report) => report.reportedUser)
  reported: Report[];

  @OneToMany(() => Report, (report) => report.reportUser)
  reports: Report[];

  @OneToOne(() => Token, (token) => token.user)
  token: Token;

  @OneToOne(() => TotalCount, (totalCount) => totalCount.user)
  totalCount: TotalCount;

  @ManyToOne(() => Category, (category) => category.activityUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'activity_category_id', referencedColumnName: 'id' }])
  activityCategory: Category;

  @ManyToOne(() => Category, (category) => category.hopeUsers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'hope_category_id', referencedColumnName: 'id' }])
  hopeCategory: Category;

  @OneToMany(() => UserBadge, (userBadge) => userBadge.user)
  userBadges: UserBadge[];

  @OneToOne(() => UserImage, (userImage) => userImage.user)
  userImage: UserImage;

  @OneToOne(() => UserIntro, (userIntro) => userIntro.user)
  userIntro: UserIntro;

  @OneToOne(() => UserRanking, (userRanking) => userRanking.user)
  userRanking: UserRanking;
}
