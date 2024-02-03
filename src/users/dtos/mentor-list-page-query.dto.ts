import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { User } from '../entities/user.entity';
import { SortOrder } from 'src/common/constants/sort-order.enum';

/**
 * @todo create provider enum, mentorOrderField
 */
export class MentorListPageQueryDto
  extends PageQueryDto
  implements Partial<Pick<User, 'id'>>
{
  id?: number;

  provider?: string;

  name?: string;

  loadOnlyMentor: boolean = true;

  hopeCategoryId: number;

  activityCategoryId: number;

  orderField;

  sortOrder: SortOrder = SortOrder.Asc;
}
