import { User } from '@src/users/entities/user.entity';
import { ReportType } from '@src/reports/constants/report-type.enum';
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
    enum: ReportType,
  })
  type: ReportType;

  @Column('varchar', { name: 'reason', comment: '신고 상세 사유', length: 255 })
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
    name: 'report_user_id',
    nullable: false,
    comment: '신고한 유저 고유 ID',
  })
  reportUserId: number;

  @ManyToOne(() => User, (user) => user.reports, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'report_user_id', referencedColumnName: 'id' }])
  reportUser: User;

  @Column('int', {
    name: 'reported_user_id',
    nullable: false,
    comment: '신고 당한 유저 고유 ID',
  })
  reportedUserId: number;

  @ManyToOne(() => User, (user) => user.reported, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'reported_user_id', referencedColumnName: 'id' }])
  reportedUser: User;
}
