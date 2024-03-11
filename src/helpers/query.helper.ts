import { Injectable } from '@nestjs/common';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { Like } from 'typeorm';

@Injectable()
export class QueryHelper {
  buildWherePropForFind<E extends Record<string, any>>(
    filter: Partial<Record<keyof E, E[keyof E]>>,
    likeSearchFields?: readonly (keyof E)[],
  ): Record<keyof E, any> {
    const where = <Record<keyof E, any>>{};

    for (const key in filter) {
      const value = filter[key];

      if (value === undefined || value === null) {
        continue;
      }

      if (Number.isNaN(value)) {
        continue;
      }

      if (typeof value === 'string' && value.length === 0) {
        continue;
      }

      if (likeSearchFields?.includes(key)) {
        where[key] = Like(`%${value}%`);
      } else {
        where[key] = value;
      }
    }

    return where;
  }

  /**
   * 굳이 만들 필요 없는데 추후에 ORDER BY Multiple Columns를 위해 만들어 놓음
   */
  buildOrderByPropForFind<E extends Record<string, any>>(
    orderField: E[keyof E],
    sortOrder: SortOrder,
  ) {
    const order = <Record<E[keyof E], SortOrder>>{};

    order[orderField] = sortOrder;

    return order;
  }
}
