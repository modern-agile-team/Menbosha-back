import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_ranking' })
export class UserRanking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  @Column({ name: 'activity_category_list_id', nullable: true })
  activityCategoryId: number | null;

  @Column({ name: 'name', nullable: true })
  name: string | null;

  @Column({ name: 'main_field', nullable: true })
  mainField: string | null;

  @Column({ name: 'introduce', nullable: true })
  introduce: string | null;

  @Column({ name: 'career', nullable: true })
  career: string | null;

  @Column({ name: 'rank', nullable: true })
  rank: number | null;

  @Column({ name: 'review_count', nullable: true })
  reviewCount: number | null;
}
