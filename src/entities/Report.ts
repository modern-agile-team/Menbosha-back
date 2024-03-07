import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';
import { ReportType } from '@src/reports/constants/report-type.enum';

@Index('FK_report_report_user_id', ['reportUserId'], {})
@Index('FK_report_reported_user_id', ['reportedUserId'], {})
@Entity('report', { schema: 'ma6_menbosha_db' })
export class Report {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '신고 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('int', {
    name: 'report_user_id',
    comment: '신고한 유저 고유 ID',
    unsigned: true,
  })
  reportUserId: number;

  @Column('int', {
    name: 'reported_user_id',
    comment: '신고 당한 고유 ID',
    unsigned: true,
  })
  reportedUserId: number;

  @Column('enum', {
    name: 'type',
    comment: '신고 타입',
    enum: ReportType,
  })
  type: ReportType;

  @Column('varchar', { name: 'reason', comment: '신고 상세 사유', length: 200 })
  reason: string;

  @Column('timestamp', {
    name: 'created_at',
    comment: '생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
    nullable: true,
    comment: '삭제 일자',
  })
  deletedAt: Date | null;

  @ManyToOne(() => User, (user) => user.reported, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'reported_user_id', referencedColumnName: 'id' }])
  reportedUser: User;

  @ManyToOne(() => User, (user) => user.reports, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'report_user_id', referencedColumnName: 'id' }])
  reportUser: User;
}
