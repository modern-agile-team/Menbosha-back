import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HelpMeBoard } from './HelpMeBoard';
import { MentorBoard } from './MentorBoard';
import { User } from './User';
import { UserRanking } from './UserRanking';

@Entity('category', { schema: 'ma6_menbosha_db' })
export class Category {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'id',
    comment: '카테고리 고유 ID',
    unsigned: true,
  })
  id: number;

  @Column('varchar', { name: 'name', comment: '카테고리 이름', length: 20 })
  name: string;

  @OneToMany(() => HelpMeBoard, (helpMeBoard) => helpMeBoard.category)
  helpMeBoards: HelpMeBoard[];

  @OneToMany(() => MentorBoard, (mentorBoard) => mentorBoard.category)
  mentorBoards: MentorBoard[];

  @OneToMany(() => User, (user) => user.activityCategory)
  activityUsers: User[];

  @OneToMany(() => User, (user) => user.hopeCategory)
  hopeUsers: User[];

  @OneToMany(() => UserRanking, (userRanking) => userRanking.activityCategory)
  userRankings: UserRanking[];
}
