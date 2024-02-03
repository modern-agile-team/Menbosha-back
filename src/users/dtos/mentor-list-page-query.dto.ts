import { PageQueryDto } from 'src/common/dto/page-query.dto';
import { User } from '../entities/user.entity';

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

  sortOrder;
}
