import { Injectable } from '@nestjs/common';
import { SortOrder } from 'src/common/constants/sort-order.enum';
import { OrderFieldForHelper } from 'src/common/types/order-field-for-helper.type';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryBuilderHelper {
  buildWherePropForFind<E extends Record<string, any>>(
    queryBuilder: SelectQueryBuilder<E>,
    filter: Partial<Record<keyof E, E[keyof E]>>,
    boardAlias: string,
    fullTextSearchField?: readonly (keyof E)[],
  ) {
    for (const key in filter) {
      const parameterName = key;
      if (fullTextSearchField?.includes(key) && filter[key]) {
        queryBuilder
          .andWhere(
            `MATCH(${boardAlias}.${key}) AGAINST (:` +
              parameterName +
              ' IN BOOLEAN MODE)',
          )
          .setParameter(parameterName, filter[key]);
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

          continue;
        }

        queryBuilder
          .andWhere(`${boardAlias}.${key} = :` + parameterName)
          .setParameter(parameterName, filter[key]);
      } else if (filter[key]) {
        queryBuilder
          .andWhere(`${boardAlias}.${key} = :` + parameterName)
          .setParameter(parameterName, filter[key]);
      }
    }
  }

  buildOrderByPropForFind<E extends Record<string, any>>(
    queryBuilder: SelectQueryBuilder<E>,
    boardAlias: string,
    orderField: OrderFieldForHelper,
    sortOrder: SortOrder,
  ) {
    orderField !== 'RAND()'
      ? queryBuilder.orderBy(`${boardAlias}.${orderField}`, sortOrder)
      : queryBuilder.orderBy(orderField);
  }
}
