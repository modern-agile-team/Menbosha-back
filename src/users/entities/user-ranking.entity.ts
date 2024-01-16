import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_ranking' })
export class UserRanking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'activity_category_list_id' })
  activityCategoryId: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'main_field' })
  mainField: string;

  @Column({ name: 'introduce' })
  introduce: string;

  @Column({ name: 'career' })
  career: string;

  @Column({ name: 'rank' })
  rank: number;

  @Column({ name: 'review_count' })
  reviewCount: number;
}
