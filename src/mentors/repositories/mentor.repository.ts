import { Injectable } from '@nestjs/common';
import { User } from '@src/users/entities/user.entity';
import { EntityManager } from 'typeorm';
import { MentorOrderField } from '../constants/mentor-order-field.enum';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { QueryBuilderHelper } from '@src/helpers/query-builder.helper';

@Injectable()
export class MentorRepository {
  private readonly FULL_TEXT_SEARCH_FIELD: readonly (keyof Pick<
    User,
    'name'
  >)[] = ['name'];

  constructor(
    private readonly entityManager: EntityManager,
    private readonly queryBuilderHelper: QueryBuilderHelper,
  ) {}

  async findAllMentorsAndCount(
    skip: number,
    pageSize: number,
    orderField: MentorOrderField,
    sortOrder: SortOrder,
    filter: {
      id?: number;
      name?: string;
      activityCategoryId: number;
    },
  ) {
    const queryBuilder = this.entityManager
      .getRepository(User)
      .createQueryBuilder('user')
      .innerJoin('user.userImage', 'userImage')
      .innerJoin('user.userIntro', 'userIntro')
      .leftJoin('user.mentor', 'mentor')
      .leftJoin('user.mentorBoard', 'mentorBoard')
      .select([
        'user.id as id',
        'user.name as name',
        'user.rank as user_rank',
        'JSON_OBJECT("imageUrl", userImage.imageUrl) as userImage',
        'JSON_OBJECT("shortIntro", userIntro.shortIntro, "customCategory", userIntro.customCategory) as userIntro',
        'COUNT(DISTINCT mentor.id) as mentorReviewCount',
        'COUNT(DISTINCT mentorBoard.id) as mentorBoardCount',
      ])
      .where('user.isMentor = true');

    this.queryBuilderHelper.buildWherePropForFind(
      queryBuilder,
      filter,
      'user',
      this.FULL_TEXT_SEARCH_FIELD,
    );

    this.queryBuilderHelper.buildOrderByPropForFind(
      queryBuilder,
      'user',
      orderField,
      sortOrder,
    );

    return Promise.all([
      queryBuilder.getCount(),
      queryBuilder.offset(skip).limit(pageSize).groupBy('id').getRawMany(),
    ]);
  }
}
