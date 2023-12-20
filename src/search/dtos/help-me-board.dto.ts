import { ApiProperty } from '@nestjs/swagger';
import { HelpMeBoardImage } from 'src/boards/entities/help-me-board-image.entity';
import { HelpMeBoard } from 'src/boards/entities/help-me-board.entity';
import { CategoryList } from 'src/common/entity/category-list.entity';
import { User } from 'src/users/entities/user.entity';

export class HelpMeBoardDto
  implements Omit<HelpMeBoard, 'userId' | 'categoryId'>
{
  @ApiProperty({})
  id: number;
  head: string;
  body: string;
  user: User;
  helpMeBoardImages: HelpMeBoardImage[];
  categoryList: CategoryList;
  createdAt: Date;
  updatedAt: Date;
}
