import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { QueryBuilderHelper } from '@src/helpers/query-builder.helper';
import { MentorOrderField } from '@src/mentors/constants/mentor-order-field.enum';
import { User } from '@src/entities/User';

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
      .leftJoin('user.reviewed', 'reviewed')
      .leftJoin('user.mentorBoards', 'mentorBoards')
      .select([
        'user.id as id',
        'user.name as name',
        'user.rank as user_rank',
        'JSON_OBJECT("imageUrl", userImage.imageUrl) as userImage',
        'JSON_OBJECT("shortIntro", userIntro.shortIntro, "customCategory", userIntro.customCategory) as userIntro',
        'COUNT(DISTINCT reviewed.id) as mentorReviewCount',
        'COUNT(DISTINCT mentorBoards.id) as mentorBoardCount',
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
