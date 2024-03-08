import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { MentorBoardOrderField } from '@src/boards/constants/mentor-board/mentor-board-order-field.enum';
import { PageQueryDto } from '@src/common/dto/page-query.dto';
import { IsPositiveInt } from '@src/common/decorators/validators/is-positive-int.decorator';
import { SortOrder } from '@src/common/constants/sort-order.enum';
import { Transform } from 'class-transformer';
import { stringToBoolean } from '@src/common/decorators/transformer/string-to-boolean.transformer';
import { MENTOR_BOARD_HEAD_LENGTH } from '@src/boards/constants/mentor-board/mentor-board.constant';

export class MentorBoardPageQueryDto extends PageQueryDto {
  @ApiPropertyOptional({
    description: '멘토 게시글 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  id?: number;

  @ApiPropertyOptional({
    description: '유저 고유 ID 필터링',
    format: 'integer',
  })
  @IsOptional()
  @IsPositiveInt()
  userId?: number;

  @ApiPropertyOptional({
    description: '제목 필터링',
    minLength: MENTOR_BOARD_HEAD_LENGTH.MIN,
    maxLength: MENTOR_BOARD_HEAD_LENGTH.MAX,
  })
  @IsOptional()
  @Length(MENTOR_BOARD_HEAD_LENGTH.MIN, MENTOR_BOARD_HEAD_LENGTH.MAX)
  head?: string;

  @ApiPropertyOptional({
    description: '본문 필터링',
  })
  @IsOptional()
  @IsNotEmpty()
  body?: string;

  @ApiProperty({
    description: '조회할 category의 id',
    format: 'integer',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsPositiveInt()
  categoryId: number = 1;

  @ApiProperty({
    description: '인기 게시글만 불러올 지, 모든 글을 불러올 지 여부',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(stringToBoolean)
  loadOnlyPopular: boolean = false;

  @ApiProperty({
    description: '정렬의 기준으로 잡을 필드',
    enum: MentorBoardOrderField,
    default: MentorBoardOrderField.id,
  })
  @IsOptional()
  @IsEnum(MentorBoardOrderField)
  orderField: MentorBoardOrderField = MentorBoardOrderField.id;

  @ApiProperty({
    description: '오름차순 혹은 내림차순',
    enum: SortOrder,
    default: SortOrder.ASC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.ASC;
}
