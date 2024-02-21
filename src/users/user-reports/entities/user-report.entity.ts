import { User } from 'src/users/entities/user.entity';
import { UserReportType } from 'src/users/user-reports/constants/user-report-type.enum';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '신고 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('enum', {
    name: 'type',
    comment: '신고 타입',
    enum: [
      UserReportType.HateSpeech,
      UserReportType.IllegalPost,
      UserReportType.PromotionalPost,
    ],
  })
  type: UserReportType;

  @Column('varchar', { name: 'reason', comment: '신고 상세 사유', length: 200 })
  reason: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @Column('int', {
    name: 'user_id',
    nullable: false,
    comment: '유저 고유 ID',
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.reports, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
  user: User;
}
