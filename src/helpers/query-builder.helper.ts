import { Injectable } from '@nestjs/common';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { OrderFieldForHelper } from '@src/common/types/order-field-for-helper.type';
import { SelectQueryBuilder } from 'typeorm';

@Injectable()
export class QueryBuilderHelper {
  buildWherePropForFind<E extends Record<string, any>>(
    queryBuilder: SelectQueryBuilder<E>,
    filter: Partial<Record<keyof E, E[keyof E]>>,
    alias: string,
    fullTextSearchField?: readonly (keyof E)[],
  ) {
    for (const key in filter) {
      const parameterName = key;

      if (fullTextSearchField?.includes(key) && filter[key]) {
        queryBuilder
          .andWhere(
            `MATCH(${alias}.${key}) AGAINST (:` +
              parameterName +
              ' IN BOOLEAN MODE)',
          )
          .setParameter(parameterName, filter[key]);
      } else if (
        (key === 'categoryId' && filter[key] === 1) ||
        (key === 'activityCategoryId' && filter[key] === 1)
      ) {
        continue;
      } else if (typeof filter[key] === 'boolean') {
        if (key === 'loadOnlyPopular') {
          filter[key] &&
            queryBuilder.andWhere(`${alias}.popularAt IS NOT NULL`);

          continue;
        } else if (key === 'loadOnlyPullingUp') {
          filter[key] &&
            queryBuilder.andWhere(`${alias}.pullingUp IS NOT NULL`);

          continue;
        }

        queryBuilder
          .andWhere(`${alias}.${key} = :` + parameterName)
          .setParameter(parameterName, filter[key]);
      } else if (filter[key]) {
        queryBuilder
          .andWhere(`${alias}.${key} = :` + parameterName)
          .setParameter(parameterName, filter[key]);
      }
    }
  }

  buildOrderByPropForFind<E extends Record<string, any>>(
    queryBuilder: SelectQueryBuilder<E>,
    alias: string,
    orderField: OrderFieldForHelper,
    sortOrder: SortOrder,
  ) {
    orderField !== 'RAND()'
      ? queryBuilder.orderBy(`${alias}.${orderField}`, sortOrder)
      : queryBuilder.orderBy(orderField);
  }
}
