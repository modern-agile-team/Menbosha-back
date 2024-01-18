import { applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseMentorBoardHotPostPaginationDto } from 'src/boards/dto/mentorBoard/response-mentor-board-hot-post-pagination.dto';

export function ApiFindAllHotPostsWithPagination() {
  return applyDecorators(
    ApiOperation({
      summary: '멘토 게시판의 인기 글 pagination',
      description:
        'page및 limit, 정렬할 필드 및 오름차순 내림차순을 클라이언트에게서 받습니다.',
    }),
    ApiResponse({
      status: 200,
      description: '멘토 게시판 인기글 성공적으로 불러옴.',
      schema: {
        properties: {
          content: {
            type: 'object',
            $ref: getSchemaPath(ResponseMentorBoardHotPostPaginationDto),
          },
        },
      },
    }),
    ApiExtraModels(ResponseMentorBoardHotPostPaginationDto),
  );
}
