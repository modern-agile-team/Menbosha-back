import { ApiProperty } from '@nestjs/swagger';
import { HelpMeBoardImage } from '@src/boards/entities/help-me-board-image.entity';

export class SearchHelpMeBoardImageDto
  implements Pick<HelpMeBoardImage, 'imageUrl'>
{
  @ApiProperty({
    description: '',
  })
  imageUrl: string;
}
