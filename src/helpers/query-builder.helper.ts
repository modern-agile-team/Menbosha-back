import { Injectable } from '@nestjs/common';
import { HelpMeBoardOrderField } from 'src/boards/constants/help-me-board-order-field.enum';
import { MentorBoardOrderField } from 'src/boards/constants/mentor-board-order-field.enum';
import { SortOrder } from 'src/common/constants/sort-order.enum';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryBuilderHelper {
  buildWherePropForBoardFind<E extends Record<string, any>>(
    queryBuilder: SelectQueryBuilder<E>,
    filter: Partial<Record<keyof E, E[keyof E]>>,
    boardAlias: string,
    fullTextSearchField?: readonly (keyof E)[],
  ) {
    for (const key in filter) {
      if (fullTextSearchField?.includes(key) && filter[key]) {
        queryBuilder.andWhere(
          `MATCH(${boardAlias}.${key}) AGAINST (:searchQuery IN BOOLEAN MODE)`,
          {
            searchQuery: filter[key],
          },
        );
      } else if (key === 'categoryId' && filter[key] === 1) {
        continue;
      } else if (typeof filter[key] === 'boolean') {
        if (key === 'loadOnlyPopular') {
          filter[key] &&
            queryBuilder.andWhere(`${boardAlias}.popularAt IS NOT NULL`);

          continue;
        } else if (key === 'loadOnlyPullingUp') {
          filter[key] &&
            queryBuilder.andWhere(`${boardAlias}.pullingUp IS NOT NULL`);
        }

        queryBuilder.andWhere(`${boardAlias}.${key} = :key`, {
          key: filter[key],
        });
      } else if (filter[key]) {
        queryBuilder.andWhere(`${boardAlias}.${key} = :key`, {
          key: filter[key],
        });
      }
    }
  }

  buildOrderByPropForBoardFind<E extends Record<string, any>>(
    queryBuilder: SelectQueryBuilder<E>,
    boardAlias: string,
    orderField: MentorBoardOrderField | HelpMeBoardOrderField,
    sortOrder: SortOrder,
  ) {
    orderField !== 'RAND()'
      ? queryBuilder.orderBy(`${boardAlias}.${orderField}`, sortOrder)
      : queryBuilder.orderBy(orderField);
  }
}
