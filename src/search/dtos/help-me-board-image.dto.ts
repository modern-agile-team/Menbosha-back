import { ApiProperty } from '@nestjs/swagger';
import { HelpMeBoardImage } from '@src/entities/HelpMeBoardImage';

export class SearchHelpMeBoardImageDto
  implements Pick<HelpMeBoardImage, 'imageUrl'>
{
  @ApiProperty({
    description: '',
  })
  imageUrl: string;
}
