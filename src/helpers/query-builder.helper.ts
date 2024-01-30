import { Injectable } from '@nestjs/common';
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
}
