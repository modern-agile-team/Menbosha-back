import { HelpMeBoard } from '@src/entities/HelpMeBoard';
import { MentorBoard } from '@src/entities/MentorBoard';
import { User } from '@src/entities/User';
import { UserRanking } from '@src/entities/UserRanking';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('category')
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
